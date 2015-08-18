var express = require('express');
var router = express.Router();

//Variable de los controladores de preguntas y respuestas
var quizController = require('../controllers/quiz_controller');
//Variable de los controladores de comentarios
var commentController = require('../controllers/comment_controller');
//Variable de los controladores de session
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId
router.param('quizId',quizController.load);
//Autoload :commentId
router.param('commnetId',commentController.load);
//Definicion de rutas de session
router.get('/login', sessionController.new);      //formulario login
router.post('/login', sessionController.create);  //crear session
router.get('/logout', sessionController.destroy); //destruir login

//Rutas de quizes
router.get('/quizes' , quizController.index);
router.get('/quizes/:quizId(\\d+)' , 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer' , quizController.answer);
router.get('/quizes/new' , 					sessionController.loginRequired, quizController.new);
router.post('/quizes/create' , 				sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit' , 	sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)' , 		sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)' , 	sessionController.loginRequired, quizController.destroy);

//Rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new' , commentController.new);
router.post('/quizes/:quizId(\\d+)/comments' , commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commnetId(\\d+)/publish' ,sessionController.loginRequired, commentController.publish);

/* GET author page. */
router.get('/author', function(req, res) {
  res.render('author', { author: 'Félix Guerra', info: 'Alumno de MiriadaX.' ,errors:[]});
});

module.exports = router;
