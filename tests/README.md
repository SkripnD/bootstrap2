This directory contains various tests for the basic application.

Tests in `codeception` directory are developed with [Codeception PHP Testing Framework](http://codeception.com/).

After creating the basic application, follow these steps to prepare for the tests:

1. Install Codeception if it's not yet installed:

   ```
   composer global require "codeception/codeception=2.0.*"
   composer global require "codeception/specify=*"
   composer global require "codeception/verify=*"
   ```

   If you've never used Composer for global packages run `composer global status`. It should output:

   ```
   Changed current directory to <directory>
   ```

   Then add `<directory>/vendor/bin` to you `PATH` environment variable. Now we're able to use `codecept` from command
   line globally.

2. Install faker extension by running the following from template root directory where `composer.json` is:

   ```
   composer require --dev yiisoft/yii2-faker:*
   ```

3. Create `bootstrap2_tests` database and update it by applying migrations:

   ```
   php codeception/bin/yii migrate --migrationPath=@yii/rbac/migrations/
   php codeception/bin/yii migrate
   ```

4. Build the test suites:

   ```
   codecept build
   ```

5. Now you can run the tests with the following commands:

   ```
   codecept run
   ```

Code coverage support
---------------------

By default, code coverage is disabled in `codeception.yml` configuration file, you should uncomment needed rows to be able
to collect code coverage. You can run your tests and collect coverage with the following command:

```
#collect coverage for all tests
codecept run --coverage-html --coverage-xml

#collect coverage only for unit tests
codecept run unit --coverage-html --coverage-xml

#collect coverage for unit and functional tests
codecept run functional,unit --coverage-html --coverage-xml
```

You can see code coverage output under the `tests/_output` directory.