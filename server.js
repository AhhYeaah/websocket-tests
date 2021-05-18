//crypto so I can generate an random id
const crypto = require("crypto");

//express and socket.io
const express = require('express')
const app  = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//cors
app.use(require('cors')());

//mongoose for db and dotenv to hide the db credentials
const mongoose = require('mongoose')
require('dotenv').config()

//Connecting said mongoose
mongoose.connect(process.env.DB_CONNECTION,
  {useNewUrlParser: true} , ()=>{
  console.log("Connected!")
})

/* This allows me to view html files and render them */
const path = require('path');
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine' , 'html');

//Importing routes from routes files
const postRoute = require('./routes/connect.js');
const getRoute = require('./routes/page')

function refreshList(){
  //This basicaly refreshs the list of sockets on export.modules
  // if the amount of sockets is greater than 0
  let amount = 0
  io.sockets.sockets.forEach(element =>{
    amount++
  })
  if(amount < 0){
    module.exports = io
  }else{
    module.exports = undefined
  }
}

app.use('/connect', postRoute);

app.use('/', getRoute);



io.on('connection', socket=>{
  //This will show me what socket connected to my server
  console.log(`Socket conectado: ${socket.id}`);

  //Then I will get the id and join it with random bytes
  let id = crypto.randomBytes(50).toString('hex') + socket.id
  //Then, im going to shuffle it
  let shuffle = id.split('').sort(function(){return 0.5-Math.random()}).join('');
  //Thats the client id.
  console.log(shuffle);

  socket.shuffle = shuffle

  socket.emit('sendMessage', shuffle);
  refreshList()

  socket.on('disconnect', () =>{
    refreshList()
    console.log(`Socket desconectado: ${socket.shuffle}`);
  })
});



server.listen(process.env.PORT || 3000);