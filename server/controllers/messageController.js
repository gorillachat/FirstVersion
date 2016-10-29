
const {Room, User, Msg} = require('../../Schemas/Tables.js');
const socket = require('../server.js');



module.exports = {
  postMessage: (req,res,next) => {
    console.log(socket);
   res.setHeader('content-type', 'application/json', 'utf-8');
    const room_identification = req.params.roomid;
    //parse req.body and save Object as headers
    const MessageToSave = req.body;
    MessageToSave.createdby = req.cookies.displayname;
    MessageToSave.roomID = room_identification;
    //store to database
    //adding the destructured object to the database table (Msg)
    //if err => send err, if !err => res.send(success)
    Msg.create(MessageToSave)
    .then( (result) => {
      res.statusCode = 200;
      res.send(JSON.stringify(result));
      next();
    })
    .catch ( (err) => {
      console.log(err);
       res.statusCode = 400;
       res.send(JSON.stringify(err) );
       next();
    });


  },
  getMessage: (req,res,next) => {
    //default headers
    res.setHeader('content-type','application/json');

    //getting room id from get request
    const roomID = req.params.roomid;

    //retrieve an array of messages from database
    Msg.findAll( { where : {roomID: roomID}}).then(msgObjArray => {
      Room.find({where: {_id: roomID}}).then(roomObj => {
        // bundle room data and message data
        const data = {msgs: msgObjArray, roomObj};
        res.send(JSON.stringify(data));
      });
    });
  }
}
