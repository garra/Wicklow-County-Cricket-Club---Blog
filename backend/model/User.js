const mongoose = require ('mongoose')
const Schema   = mongoose.Schema

const UserSchema = new Schema ({
    first_name : {
        type : String ,
        required : true
    },
    surname  : {
        type : String
    },
    username : {
        type : String ,
        required : true
    },
    email : {
        type : String ,
        required : true
    },
    mobile : {
        type : String ,
        required : true
    },
    password : {
        type : String ,
        required : true
    },
    role : {
        type : String,
        default : 'user'
    },
    date : {
        type : String ,
        default : Date.now
    },
})

module.exports = Users = mongoose.model ('users', UserSchema)