//crypto so I can generate an random id
const crypto = require("crypto");

//express and socket.io
const app  = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//cors
const cors = require('cors')

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

server.use(cors());
app.use(cors());

app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine' , 'html');

//Importing routes from routes files
const postRoute = require('./routes/connect');

function refreshList(){
  let only_io = io;
  module.exports = only_io;
}

app.use('/connect', postRoute);

app.get('/', (req, res)=>{
  res.render('index.html');
});



io.on('connection', socket=>{
  //This will show me what socket connected to my server
  console.log(`Socket conectado: ${socket.id}`);

  //Then I will get the id and join it with random bytes
  var id = crypto.randomBytes(50).toString('hex') + socket.id
  //Then, im going to shuffle it
  var shuffle = id.split('').sort(function(){return 0.5-Math.random()}).join('');
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