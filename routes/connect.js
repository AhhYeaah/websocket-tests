const express = require('express');
const { restart } = require('nodemon');
let list;
const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

const PostModel = require('../models/connectionReq');

router.get('/', (req, res) => {
    res.render('connect.html');
});

router.post('/request', (req, res) => {
    //Get the updated list

    let list = require('../server');
    
    if (list && list.sockets != undefined) {
        //Here i am picking all sockets from the list sent from server
        let socket_list = []
        list.sockets.sockets.forEach(element => {
            socket_list.push(element);
        });
        if (req.body && Object.keys(req.body).length != 0 && req.body.constructor === Object) {
            //Them getting the body so i can do some tests with it
            let body = Object.keys(req.body);
            //See if the json is on the state that i want it to be
            if (body.includes("Phone") && body.includes("PassWord")
                && body.includes("Data")) {
                //Second test for the sub object qrcode
                if (Object.keys(req.body.PassWord).includes("QRCode")) {

                    /* 
                     * Thats a little complicated, sorry.
                     * So im looping through all the sockets and seeing if one of them has the qrcode
                     * if it has, it will return true, if not it will return undefined, those values will
                     * be stored in a array, later on I will test this array and see if it contains a true
                     * (In that case, the code sended by the user will be valid)
                     */
                    for (let index = 0; index < socket_list.length; index++) {
                        const element = socket_list[index];
                        if(element.shuffle == req.body.PassWord.QRCode){
                            res.status(200).send("Sucess")
                            element.emit('refreshPage', 'Sucess')
                        }else if(index == socket_list.length-1){
                            res.status(404).send("Not found");
                        }
                    }
                } else {
                    res.status(502).send("Bad Gateway")
                }
            } else {
                res.status(502).send("Bad Gateway")
            }
        }else{
            res.status(502).send("Body is empty")
        }
    }else{
        res.status(500).send("Server down")
    }
});

module.exports = router;