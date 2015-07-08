var models = require('../models/models.js');

// Autoload - factoriza el codigo si su ruta incluye :quizId - Gestion de errores - Pregunta no existe en DB
exports.load = function(req,res,next,quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else{ next(new Error('No existe quizId = '+quizId)); }
		}
	).catch(function(error) { next(error); });
};

//GET /quizes y /quizes?search=
exports.index = function(req,res){
	var busqueda = "";
	var title = "Quizes"
	if (req.query.search !== undefined) {
		var searchSQL = req.query.search.replace(' ','%');
		searchSQL = '%'+searchSQL+'%';
		busqueda = {where: ["pregunta like ?", searchSQL], order: 'pregunta ASC'};
		title = 'Búsqueda "' + req.query.search + '"';
	}
	models.Quiz.findAll(busqueda).then(function(quizes){
		res.render('quizes/index',{quizes:quizes,title:title});
	}).catch(function(error) { next(error); });
};

//GET /quizes/question
exports.show = function(req,res){
	res.render('quizes/show',{quiz:req.quiz,title:'Quiz'});
};

//GET /quizes/answer
exports.answer = function(req,res){
	var resultado='Incorrecto';
	if(req.query.respuesta===req.quiz.respuesta){
		resultado='Correcto';
	}
	res.render('quizes/answer',{quiz:req.quiz,respuesta:resultado,title:'Quiz'});
};