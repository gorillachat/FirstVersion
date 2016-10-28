const express = require('express');
const {postMessage} = require('./controllers/messageController.js');
const {getRooms} = require('./controllers/roomController.js');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const Server = require('socket.io');
const io = new Server();
const passport = require('passport');
const session = require('express-session');
const localStrat = require('passport-local').Strategy;


const any = require('../Schemas/Tables.js');

// Create our app
const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(express.static('public'));
app.use(express.static(__dirname + '../public'));
app.use(express.session({ secret: 'secretcode' }));
app.use(passport.initialize());
app.use(app.router);

//with successful authentication user is redirected to homepage. Otherwise, redirected back to login page.
app.post('/login',
	passport.authenticate('local', { successRedirect: '/',
																	 failureRedirect: '/login'}));

//Express route to get list of rooms in a nearby area
//responds with list of rooms
app.get('/roomlist', getRooms )


//Express route for saving message from specfic room:id
app.post('/rooms/:roomid', postMessage , (req,res) => res.end()) //added af for end()

//testing socket io connection
io.on('connection', (socket) => {
    socket.emit('test', {hello: 'hello world'});
});

//listening on port 3000
app.listen(3000, () => console.log('Express server is up on port 3000'));
