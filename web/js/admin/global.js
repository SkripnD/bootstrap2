/**
 * Global methods
 */
var global = {

    init: function() {
        this.settings();
        this.binding();
    },

    settings: function() {
        $.ajaxSetup({
            type: "POST",
            dataType: "json",
        });
        
        $(document).ajaxSend(function(event, jqXHR, settings) {
            NProgress.start();
        });
        
        $(document).ajaxComplete(function(event, jqXHR, settings) {
            NProgress.done();
        });
        
        $(document).ajaxError(function(event, jqxhr, settings, exception) {
            console.log(jqxhr.responseText);
        });
        
        // Adding a csrf-token in the request
        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
            if ((originalOptions.type !== undefined && 
                 originalOptions.type.toLowerCase() == 'post') ||
                (options.type !== undefined && options.type.toLowerCase() == 'post')) {
                var data = originalOptions.data;

                if (originalOptions.data !== undefined) {
                    if (Object.prototype.toString.call(originalOptions.data) === '[object String]') {
                        data = $.deparam(originalOptions.data);
                    }
                } else {
                    data = {};
                }

                try {
                    options.data = $.param($.extend(data, {
                        'csrf-token': $('meta[name="csrf-token"]').attr('content')
                    }));
                    
                } catch (e) {
                    
                }
            }
        });
    },

    binding: function() {
        // Sidebar, opening sub-menu
        $('.sidebar').on('click', 'a', function() {
            if ($(this).next('ul').length) {
                $('.sidebar li .nav').hide();
                $(this).next('.nav').toggle();
            }
        });
        
        // Confirmation
        $(document).on('click', '.confirmation', function (e) {
            if (!confirm($(this).data('confirmation'))) {
                e.stopImmediatePropagation();
                return false;
            }
        });
        
        // Gridview, ajax submit
        $(document).on('click', '.gridview .submit', function (e) {
            var self  = this,
                $form = $(this).closest('form');

            $.post(
                $(self).prop('href') ? $(self).prop('href') : $form.prop('action'), 
                $form.serialize() + '&' + $(self).prop('name') + '=' + $(self).val(),
                function (data) {
                    $(self).closest('.gridview').yiiGridView('applyFilter');
                    return false;
                }
            );
            
            return false;
        });
        
        // Gridview, checkbox
        $(document).on('click', '.gridview tbody tr td input[type="checkbox"]', function () {
            if ($(this).is(':checked')) {
                $(this).closest('tr').addClass('active');
            } else {
                $(this).closest('tr').removeClass('active');
            }
            
            var $gridview = $(this).closest('.gridview');
            var $operations = $gridview.find('.operations button');

            if ($gridview.find('tbody input:checked').size()) {
                $operations.removeClass('disabled');
            } else {
                $operations.addClass('disabled');
            }
        });
        
        // Gridview, check all
        $(document).on('click', '.gridview .select-on-check-all', function () {
            var $checks = $(this).closest('table').find('tbody input[type="checkbox"]').closest('tr');
            var $gridview = $(this).closest('.gridview');
            var $operations = $gridview.find('.operations button');
            
            if ($(this).is(':checked')) {
                $checks.addClass('active');
                $operations.removeClass('disabled');
            } else {
                $checks.removeClass('active');
                $operations.addClass('disabled');
            }
        });
        
        // Auto remove
        if ($('.auto-remove').length) {
            setTimeout(function() {
                $('.auto-remove').slideUp(300, function() {
                    $(this).remove();
                });
            }, 3000);
        }
        
        /** Cloning, usage: 
            <div class="clone-block">
                <div class="clone-item">Item</div>
                <a class="clone">Add</a>
            </div>
        */
        $('.clone-block').on('click', '.clone', function() {
            var $block = $(this).closest('.clone-block');
            $block.find('.clone-item:eq(0)').clone().show().insertAfter($block.find('.clone-item:last'));
        });
        
        /** Remove item, usage: 
            <li>Item<a class="remove" data-remove-closest="li">Del</a></li>
        */
        $(document).on('click', '.remove', function() {
            $(this).closest($(this).data('remove-closest')).remove();
        });
    },
};

$(function () {
    global.init();
});

/**
 * An extraction of the deparam method from Ben Alman's jQuery BBQ
 * https://github.com/chrissrogers/jquery-deparam
 */
(function(h){h.deparam=function(i,j){var d={},k={"true":!0,"false":!1,"null":null};h.each(i.replace(/\+/g," ").split("&"),function(i,l){var m;var a=l.split("="),c=decodeURIComponent(a[0]),g=d,f=0,b=c.split("]["),e=b.length-1;/\[/.test(b[0])&&/\]$/.test(b[e])?(b[e]=b[e].replace(/\]$/,""),b=b.shift().split("[").concat(b),e=b.length-1):e=0;if(2===a.length)if(a=decodeURIComponent(a[1]),j&&(a=a&&!isNaN(a)?+a:"undefined"===a?void 0:void 0!==k[a]?k[a]:a),e)for(;f<=e;f++)c=""===b[f]?g.length:b[f],m=g[c]=
f<e?g[c]||(b[f+1]&&isNaN(b[f+1])?{}:[]):a,g=m;else h.isArray(d[c])?d[c].push(a):d[c]=void 0!==d[c]?[d[c],a]:a;else c&&(d[c]=j?void 0:"")});return d}})(jQuery);