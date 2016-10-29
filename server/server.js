const express = require('express');
const {postMessage, getMessage} = require('./controllers/messageController.js');
const {getRooms, createRoom} = require('./controllers/roomController.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const PassportGithub = require('passport-github2').Strategy;
const Sequelize = require('sequelize');
const session = require('express-session');
const Server = require('socket.io');
const io = new Server();
const path = require('path');
const {Room, User, Msg} = require('../Schemas/Tables.js');
// Create our app
const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(express.static(path.join(__dirname, '../public')));
app.use(passport.initialize());

const GITHUB_CLIENT_ID = "f49edca599db1718b4da";
const GITHUB_CLIENT_SECRET = "7b96bb2b9f6c9b9ce5ec309862da5592f40708e3";
const passportObject = {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github_oauth/callback"
};
//Passport session setup - we need to store the user ID when serializing, and find the user by ID when deserializing.
passport.serializeUser( (user, done) => done(null, user));

passport.deserializeUser((obj, done) => done(null, obj));

//utilizing the GitHubStrategy within Passport. the Verify function will invoke a callback with a user object.
passport.use(
  new PassportGithub(passportObject,(accessToken, refreshToken, profile, done) => {
    User.findOrCreate( {where: {displayname: profile.id}})
    .then( (user) => done(null, user))
    .catch( err => res.send(err));
  }));

app.get('/login', (req,res) => res.sendFile(path.join(__dirname, '../public/login.html')));

app.get('/auth/github_oauth/callback', passport
  .authenticate('github', { failureRedirect: '/login'}),
  (req, res) => {
  	res.cookie('session', req.session);
  	res.redirect('/');
	});

//with successful authentication user is redirected to homepage. Otherwise, redirected back to login page.
app.post('/login', (req,res,next) => next(), passport
   .authenticate('github', {
                successRedirect: '/',
							  failureRedirect: '/login',
						    failureFlash: true }));


//Express route to get list of rooms in a nearby area
//responds with list of rooms
app.get('/roomlist', getRooms )

//Express route for saving message from specfic room:id
app.post('/rooms/:roomid', postMessage , (req,res) => res.end()) //added af for end()

//Express route for returing list of messages for specific :roomid
app.get('/rooms/:roomid', getMessage, (req, res) => res.end());

app.post('/createroom', createRoom, (req, res) => res.end());

//testing socket io connection
io.on('connection', (socket) => {
    socket.emit('test', {hello: 'hello world'});
});

//listening on port 3000
app.listen(3000, () => console.log('Express server is up on port 3000'));
