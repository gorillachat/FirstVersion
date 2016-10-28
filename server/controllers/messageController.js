



module.exports = {

  postMessage: (req,res,next) => {
    res.setHeader('content-type', 'application/json', 'utf-8');
    //set headers
    const roomID = req.params.id;
    //parse req.body and save Object as headers
    const headers = JSON.parse(req.body);


    //destructuring the req.body which contains
    //creator, time , room, and messageBody (the message itself)
    //each key:value is set to a constant
    //ex: const creator = ryan, time = 12:30, room = 3, msgBody = 'this is an ex'
    const { creator, time, room, msgBody } = headers;

    //store to database
    //adding the destructured object to the database table (Msg)
    Msg.create('Msg', { creator, time, room, msgBody });

    //call next
    next();
  },
  getMessage: (req,res,next) => {
    //default headers
    res.setHeaders('content-type','application/json', 'utf-8');

    //getting room id from get request
    const roomID = req.params.id;

    //retrieve an array of messages from database
    const data = Msg.Findall(where : {_id: roomID});

    //send stringified data to the client
    res.send(JSON.stringify(data));


  }
}
