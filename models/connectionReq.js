const mongoose = require('mongoose');
const crypto = require("crypto");
var toCookie = crypto.createHmac('sha256', process.env.ENC_KEY_COOKIE);
var toConnection = crypto.createHmac('sha256', process.env.ENC_KEY_CONNECTION)


const ConnectionSchemaUnknow = mongoose.Schema({
    //TODO: here we will have cookies
    IdsToConnection: {
        Phone:{
            type: String,
            required: true
        },
        PassWord:{
            QRCodeRelated:{

                QRCode:{
                    type: String,
                    required: true,
                },

                QRCodeHash: { //for pc
                    type: String,
                    default: ()=>{
                        toCookie.update(QRCode)
                        return toCookie.digest().toString('hex')
                        //When the connection is already stored in the database this cookie will come
                        //to the computer
                    }
                }

            },
        },
        Data:{
            connectionDate:{
                type: Date,
                default: Date.now()
            },
            connectionId:{
                type: String,
                default: ()=>{
                    toConnection.update(QRCode)
                    return toConnection.digest().toString('hex')
                    //And this one to the cellphone so he can send data
                }
            }
        } 

    },
})

module.exports = mongoose.model('Posts', ConnectionSchemaUnknow)