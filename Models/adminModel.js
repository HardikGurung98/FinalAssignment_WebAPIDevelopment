
const mongoose = require('mongoose');


// creating new mongoose.Collection

const Admin = mongoose.model('Admin', {
    username:{type:String, required: [true], unique: true},
    password:{type:String, required: [true], minlength: 6},
    email:{type:String, required: [true], unique: true},
    profilePicture:{type:String, default:'media/profilePicture.png'},
    createdAt: {type: Date, default: Date.now}
})



module.exports = Admin

