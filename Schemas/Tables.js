'use strict'

const Sequelize = require('sequelize');
const Server = require('socket.io');

// const clearoutdb = require('./Schema_Tests/globalBefore');

//setting up a connection pool on initialization for now because we are connecting from a single process. If we want to connect to DB from multiple processes, we will have to create an instance PER process (code will need to be modified to add a max connection pool size etc)
const sequelize = new Sequelize('postgres://localhost:5432/ChatRoomTables');

sequelize.authenticate()
	.then( err => {
		console.log('Connection on database established');
	})
	.catch( err =>{
		console.log('Unable to connect to database',err);
	});

//Models
const Room = sequelize.define('room', {
	_id:{
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name: Sequelize.STRING,
	creatorid: Sequelize.STRING,
	lat: Sequelize.STRING,
	long: Sequelize.STRING,
	expires: Sequelize. INTEGER
});


const User = sequelize.define('user', {
	_id:{
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	displayname: Sequelize.STRING,
	password: Sequelize.STRING
	//room_id is created below via an association
})


const Msg = sequelize.define('msg', {
	_id:{
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	createdby: Sequelize.STRING,
	body: Sequelize.STRING
	//user_id is created below via an association
});

//Associations between Tables --> probably move over to get-request file

Room.hasMany(User, {as: 'users'});

//adds a room_id to the Msg model. Room.prototype gains getMsg (Room#getMsgs) & setMsgs (Room#getMsgss) as methods.
Room.hasMany(Msg, {as: 'msgs'});

//adds a user_id to the Msg model. User.prototype gains getMsgs (User#getMsgs) & setMsgs(User#getMsgs) as methods.
User.hasMany(Msg, {as: 'msgs'});

//force tables to drop each time file is run,.
sequelize.sync({ force: true }).then(() => {  });

//export tables Room, User, Msg to be used in get request files.
module.exports =  { Room, User, Msg };