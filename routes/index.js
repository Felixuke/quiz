var express = require('express');
var router = express.Router();

//Variable de los controladores de preguntas y respuestas
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId
router.param('quizId',quizController.load);

router.get('/quizes' , quizController.index);
router.get('/quizes/:quizId(\\d+)' , quizController.show);
router.get('/quizes/:quizId(\\d+)/answer' , quizController.answer);
router.get('/quizes/new' , quizController.new);
router.post('/quizes/create' , quizController.create);
router.get('/quizes/:quizId(\\d+)/edit' , quizController.edit);
router.put('/quizes/:quizId(\\d+)' , quizController.update);
router.delete('/quizes/:quizId(\\d+)' , quizController.destroy);

/* GET author page. */
router.get('/author', function(req, res) {
  res.render('author', { author: 'Félix Guerra', info: 'Alumno de MiriadaX.' ,errors:[]});
});

module.exports = router;
