



module.exports = {
  getRooms : (req,res,next) => {
    res.setHeader('content-type', 'application/json');
    //get cookie from request object
    const longitude = req.cookies.long;
    const latitude = req.cookies.lat;
    //Find all rooms
    res.send(JSON.stringify(Room.find()));

    //call next
    next();
  },

}
