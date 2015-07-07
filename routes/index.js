var express = require('express');
var router = express.Router();

//Variable de los controladores de preguntas y respuestas
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

router.get('/quizes/question' , quizController.question);
router.get('/quizes/answer' , quizController.answer);

/* GET author page. */
router.get('/author', function(req, res) {
  res.render('author', { author: 'Félix Guerra', info: 'Alumno de MiriadaX.' });
});

module.exports = router;
