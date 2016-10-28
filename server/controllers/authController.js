const passport = require('passport');
const Sequelize = require('sequelize');
const pg = require('pg').native;
const PassportLocalStrategy = require('passport-local').Strategy;
const {Room, User, Msg} = require('../../Schemas/Tables.js');
const flash = require("flash");


const auth = {};

auth.localStrategy = new PassportLocalStrategy({
	username: 'username',
	password: 'password'
});

auth.validPassword = function(password){
	return this.password === password;
}

auth.serializeUser = function(user, done){
	done(null, user);
}

auth.deserializeUser = function(obj, done){
	done(null, obj);
}

auth.searchdb = function (username, password, done){
	User.findOne({username: username}).success( user => {

		if(!user) return done(null, false, { message: 'User not found'} );

		if(user.password !== password) return done(null, false, { message: 'wrong password'});

		return done(null, { username: user.username });
	});
};


module.exports = { auth };

