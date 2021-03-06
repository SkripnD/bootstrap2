<?php

namespace tests\codeception\unit\models;

use Yii;
use yii\codeception\DbTestCase;
use app\models\forms\PasswordResetRequestForm;
use tests\codeception\fixtures\UserFixture;
use app\models\User;
use Codeception\Specify;

class PasswordResetRequestFormTest extends DbTestCase
{
    use Specify;
    
    protected function setUp()
    {
        parent::setUp();
        
        Yii::$app->mailer->fileTransportCallback = function ($mailer, $message) {
            return 'testing_message.eml';
        };
    }
    
    protected function tearDown()
    {
        @unlink($this->getMessageFile());
        parent::tearDown();
    }
    
    public function testSendEmailWrongUser()
    {
        $this->specify('no user with such email, message should not be send', function () {
            $model = new PasswordResetRequestForm();
            $model->email = 'not-existing-email@example.com';
            expect('email not send', $model->sendEmail())->false();
        });
        
        $this->specify('user is not active, message should not be send', function () {
            $model = new PasswordResetRequestForm();
            $model->email = $this->user[2]['email'];
            expect('email not send', $model->sendEmail())->false();
        });
    }
    
    public function testSendEmailCorrect()
    {
        $model = new PasswordResetRequestForm();
        $model->email = $this->user[0]['email'];
        
        $user = User::findOne(['passwordResetToken' => $this->user[0]['passwordResetToken']]);
        
        expect('email sent', $model->sendEmail())->true();
        expect('user has valid token', $user->passwordResetToken)->notNull();
        
        $this->specify('message has correct format', function () use ($model) {
            expect('message file exists', file_exists($this->getMessageFile()))->true();
        });
    }
    
    private function getMessageFile()
    {
        return Yii::getAlias(Yii::$app->mailer->fileTransportPath) . '/testing_message.eml';
    }
     
    public function fixtures()
    {
        return [
            'user' => [
                'class' => UserFixture::className(),
                'dataFile' => '@tests/codeception/fixtures/data/user.php',
            ],
        ];
    }
}
