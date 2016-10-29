const Server = require('socket.io');
const io = new Server();

module.exports = {
//testing socket io connection
	runSocket: (req,res,next) => {

		io.on('connection', (socket) => {
			console.log('Connected User');
		  socket.on('disconnect', () => {
		  	console.log('disconnected User');
			});
		  next();
		});
	}
};