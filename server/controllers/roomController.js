const {Room, User, Msg} = require('../../Schemas/Tables.js');
const RANGE = 500;
const moment = require('moment');

if (typeof (Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function () {
    return this * Math.PI / 180;
  }
}

const distance = (pos1, pos2) => {
  const lon1 = parseInt(pos1.long);
  const lat1 = parseInt(pos1.lat);
  const lon2 = parseInt(pos2.long);
  const lat2 = parseInt(pos2.lat);

  const R = 6371;
  const dlat = (lat2 - lat1).toRad();
  const dlon = (lon2 - lon1).toRad();
  const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
    Math.sin(dlon / 2) * Math.sin(dlon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  const e = d * 3048;
  return e;
}

module.exports = {
  getRooms : (req,res,next) => {
    res.setHeader('content-type', 'application/json');
    //get cookie from request object
    const userPos = {
      long: req.headers.long,
      lat: req.headers.lat,
    };
    console.log('UserPos:', userPos);
    //Find all rooms
    Room.findAll().then(allRooms => {
      console.log('# of rooms:', allRooms.length);
      const unExpiredRooms = allRooms.filter(roomObj => {
        return ((moment(roomObj.expires) - moment()) > 0);
      });
      const nearbyRooms = unExpiredRooms.filter(roomObj => {
      return (distance(userPos, {lat: roomObj.lat, long: roomObj.long}) < RANGE);
    });
    console.log('# of nearby Rooms:', nearbyRooms.length);
    console.log('nearby Rooms:', JSON.stringify(nearbyRooms));
    res.end(JSON.stringify(nearbyRooms));
  });

  },
  createRoom: (req, res, next) => {
    const newRoomLat = req.headers.lat;
    const newRoomLong = req.headers.long;
    const newRoomObj = {
      creatorid: req.cookies.user_id,
      name: req.body.name,
      lat: req.body.lat,
      long: req.body.long,
      expires: req.body.expires,
      creatorid: req.cookies.user_id
    };
    console.log(newRoomObj.creatorid);
    Room.create(newRoomObj).then( (result) => {
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
  }


}
