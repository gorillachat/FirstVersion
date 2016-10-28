const express = require('express');
const {postMessage} = require('./controllers/messageController.js');
const {getRooms} = require('./controllers/roomController.js');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const Server = require('socket.io');
const io = new Server();

// Create our app
const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(express.static('public'));

//Express route to get list of rooms in a nearby area
//responds with list of rooms
app.get('/roomlist', getRooms, (req,res) => )

//Express route for saving message from specfic room:id
app.post('/rooms/:roomid', postMessage, (req,res) =>)

//testing socket io connection
io.on('connection', (socket) => {
    socket.emit('test', {hello: 'hello world'});
});

//listening on port 3000
app.listen(3000, () => console.log('Express server is up on port 3000'));
