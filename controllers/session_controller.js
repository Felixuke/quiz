//MW de autorizacion de acceso HTTP restringidos
exports.loginRequired = function(req,res,next){
	if(req.session.user){
		next();
	}else{
		res.redirect('/login');
	}
};
// GET /login  ---  Formulario de inicio de session
exports.new = function(req,res){
	var errors = req.session.errors || {};
	req.session.errors = {};
	res.render('sessions/new',{errors:errors});
};

//GET /login  ---  Crear session
exports.create = function(req,res){
	var login = req.body.login;
	var password = req.body.password;
	
	var userController = require('./user_controller');
	userController.autenticar(login,password,function(error,user){
		if(error){ //Si hay errores de session
			req.session.errors = [{"message": 'Se ha producido un errorr: '+error}];
			res.redirect("/login");
			return;
		}
		//Creamos req.session.user y guardamos campos id y username
		//La session se define por la existencia de: req.session.user
		req.session.user = {id:user.id, username:user.username,tiempo: new Date(Date.now()).getTime(),actual: 0};
		res.redirect(req.session.redir.toString());//redirecciona a la pagina anterior a login
	});
};

// DELETE /logout  ---  Destruir session
exports.destroy = function(req,res){
	delete req.session.user;
	res.redirect(req.session.redir.toString());//redirecciona a la pagina anterior a login
};