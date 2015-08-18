var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
// Inserto para la base de datos Postgres
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

// Carga Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name,user,pwd,
						{ dialect: protocol,
						  protocol: protocol,
						  port: port,
						  host: host,	
						  storage: storage,  // Solo SQLite (.env)
						  omitNull: true     // Solo Postgres
						}
					);

// importar la definicion de la tabla Quiz en quiz.js
var quiz_path ;
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// importar la definicion de la tabla Comment en quiz.js
var comment_path ;
var Comment = sequelize.import(path.join(__dirname,'comment'));

//Ralaciono las tablas Quiz y Comment de uno a muchos
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Exportamos definicion de tabla Quiz
exports.Quiz = Quiz;

// Exportamos definicion de tabla Quiz
exports.Comment = Comment;

// Crea e inicializa la tabla Quiz
sequelize.sync().then(function(){
	Quiz.count().then(function(count){
		if(count===0){
			Quiz.create({pregunta:'¿Capital de Italia?',
						 respuesta:'Roma',
						 tema: 'ciencia'
						});
			Quiz.create({pregunta:'¿Capital de Portugal?',
						 respuesta:'Lisboa',
						 tema: 'otros'
						})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});