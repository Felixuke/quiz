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

// GET /quizes y /quizes?search=
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
		res.render('quizes/index',{quizes:quizes,title:title, errors:[]});
	}).catch(function(error) { next(error); });
};

//GET /quizes/question
exports.show = function(req,res){
	res.render('quizes/show',{quiz:req.quiz,title:'Quiz', errors:[]});
};

// GET /quizes/answer
exports.answer = function(req,res){
	var resultado='Incorrecto';
	if(req.query.respuesta===req.quiz.respuesta){
		resultado='Correcto';
	}
	res.render('quizes/answer',{quiz:req.quiz,respuesta:resultado,title:'Quiz', errors:[]});
};

// GET /quizes/new
exports.new = function(req,res){
	var quiz=models.Quiz.build(
		{pregunta:"Pregunta",respuesta:"Respuesta",tema:"otro"}
	);
	res.render('quizes/new',{quiz:quiz,title:'Crear Quiz', errors:[]});
};

//GET /quizes/create
exports.create = function(req,res){
	var quiz=models.Quiz.build( req.body.quiz);
	// guardar en BD los campos de quiz
	var errors= quiz.validate();
	
	if(errors){
		var i=0;
		var errores = new Array();
		for (var prop in errors){
			errores[i++]={message: errors[prop]};
		}
		res.render('quizes/new',{quiz: quiz,title:'Crear Quiz', errors:errores});
	}else{
		quiz
		.save({fields: ["pregunta","respuesta","tema"]})
		.then(function(){
			// Redireccion http URL relativo lista preguntas
			res.redirect('/quizes');
		});
	}
};

// GET /quizes/:id/edit
exports.edit = function(req,res){
	var quiz=req.quiz; // autoload de instanca quiz
	res.render('quizes/edit',{quiz:quiz,title:'Editar Quiz', errors:[]});
};

// PUT /quizes/:id
exports.update = function(req,res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	var errors = req.quiz.validate();
	if(errors){
		var i=0;
		var errores = new Array();
		for (var prop in errors){
			errores[i++]={message: errors[prop]};
		}
		res.render('quizes/edit',{quiz: req.quiz,title:'Editar Quiz', errors:errores});
	}else{
		req.quiz
		.save({fields: ["pregunta","respuesta","tema"]})
		.then(function(){
			// Redireccion http URL relativo lista preguntas
			res.redirect('/quizes');
		});
	}
};

// DELETE /quizes/:id
exports.destroy = function(req,res){
	req.quiz.destroy()
	.then(function(){
		// Redireccion http URL relativo lista preguntas
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};