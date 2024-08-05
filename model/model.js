const mongoose = require('mongoose');

let schema = mongoose.Schema({
    name: {
        type :String,
        required: true
    },
    date:{
        type: String,
        required : true
    },
    projectName:{
        type: String,
        required : true
    },

    task : {
        type : String,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now,
      }
})


const model =  mongoose.model('data',schema);

module.exports = model;