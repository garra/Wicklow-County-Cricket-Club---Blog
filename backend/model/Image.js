const mongoose = require ('mongoose')
const Schema   = mongoose.Schema

const ImageSchema = new Schema ({
    userId : {
       type: Schema.ObjectId
    },
    name : {
        type: String
    },
    title : {
        type : String ,
        required : true
    },
    report  : {
        type : String
    },
    image : {
        type : Array ,
    },
})

module.exports = Image = mongoose.model ('Image', ImageSchema)