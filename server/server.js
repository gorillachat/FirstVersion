const express = require('express');

// Create our app
const app = express();

app.use(express.static('public'));


app.post('/rooms/:roomid', )







//listening on port 3000
app.listen(3000, function () {
  console.log('Express server is up on port 3000');
});
