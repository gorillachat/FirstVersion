'use strict'

//require sequelize
const Sequelize = require('sequelize');

//setting up a connection pool on initialization for now because we are connecting from a single process. If we want to connect to DB from multiple processes, we will have to create an instance PER process (code will need to be modified to add a max connection pool size etc)
const sequelize = new Sequelize('postgres://localhost:5432/ChatRoomTables');

//authentication of connection
sequelize.authenticate()
	.then( err => {
		console.log('Connection on database established');
	})
	.catch( err =>{
		console.log('Unable to connect to database',err);
	});

//Room
const Room

const Msg

const User
module.exports()