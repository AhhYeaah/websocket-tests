const express = require('express');
let list;
const router = express.Router();



router.get('/', (req, res)=>{
    res.render('connect.html');
});

router.get('/request' , (req, res)=>{
  list = require('../server');
  //If is there a socket in list
    if(true){

      if(true){
      //If is there an query
        if(req.query.connection){
          //Then see all sockets and pick the one that matches the query,
          //Yes, i know, thats terribly bad, but i spent a whole 3 hours on this
          //And im very tired, sorry 
          list.sockets.sockets.forEach(element => {
            if(element.shuffle == req.query.connection){
              element.emit('refreshPage', "Sucess")
              res.status(200).send("Sucess")
            }
          });
        }else{
          res.status(503).send('Something went wrong');
        }
      }else{
        res.status(503).send('There are no sockets online');
      }
    }else{
      res.status(503).send('Something went wrong');
    }
});

module.exports = router;