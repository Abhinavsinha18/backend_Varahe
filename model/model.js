const mongoose = require('mongoose');

let schema = mongoose.Schema({
    "Project Name": {
        type: String,
        required: true
    },
    "Team Code": {
        type: String,
        required: true
    },
    "Employee Code": {
        type: String,
        required: true
    },
    "Employee name": {
        type: String,
        required: true
    },
    "Designation": {
        type: String,
        required: true
    },
    "Blood Group": {
        type: String,
        required: true
    },
    "Image Link": {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const model = mongoose.model('data', schema);

module.exports = model;
