<?php

namespace app\modules\admin\controllers;

use app\components\BaseController;
use app\models\NewsType;
use app\modules\admin\models\search\NewsTypeSearch;
use yii\filters\VerbFilter;
use yii\helpers\Url;
use Yii;

class NewsTypesController extends BaseController
{
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'delete' => ['post'],
                    'operations' => ['post'],
                ],
            ],
        ];
    }
    
    public function actions()
    {
        return [
            'operations' => [
                'class' => 'app\modules\admin\controllers\common\OperationsAction',
                'modelName' => 'app\models\NewsType',
            ],
            'delete' => [
                'class' => 'app\modules\admin\controllers\common\DeleteAction',
                'modelName' => 'app\models\NewsType',
            ],
        ];
    }
        
    public function actionIndex() 
    {
        $newsTypeSearch = new NewsTypeSearch();
        $dataProvider = $newsTypeSearch->search(Yii::$app->request->get());
        
        return $this->render('index', [
            'newsTypeSearch' => $newsTypeSearch,
            'dataProvider' => $dataProvider,
        ]);
    }

    public function actionEdit($id = null)
    {
        $model = new NewsType();

        if ($id) {
            $model = $this->loadModel($model, $id);
        }
        
        if (Yii::$app->request->isPost) {
            if ($model->load(Yii::$app->request->post()) && $model->save()) {
                Yii::$app->session->setFlash('success', Yii::t('app', 'Saved successfully'));
                return $this->response(['redirect' => Url::toRoute(['edit', 'id' => $model->id])]);   
            } else {
                return $this->response(['errors' => $model->getErrors(), 'prefix' => 'newstype-']);            
            }
        }

        return $this->render('edit', ['model' => $model]);
    }
}
