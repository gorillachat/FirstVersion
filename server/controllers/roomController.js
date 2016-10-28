



module.exports = {
  getRooms : (req,res,next) => {
    res.setHeader('content-type', 'application/json');

    //Find all rooms
    res.send(JSON.stringify(Room.find()));

    //call next
    next();
  }
}
