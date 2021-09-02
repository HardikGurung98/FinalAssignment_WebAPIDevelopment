
const mongoose = require('mongoose');


// creating new mongoose.Collection

const Teacher = mongoose.model('Teacher', {
    username:{type:String, required: [true], unique: true},
    password:{type:String, required: [true], minlength: 6},
    email:{type:String, required: [true], unique: true},
    firstName:{type:String},
    lastName:{type:String},
    bioGraphy:{type:String},
    website:{type:String},
    linkin:{type:String},
    youtube:{type:String},
    is_active:{type:Boolean, default:true},
    is_verified:{type:Boolean, default:false},
    profilePicture:{type:String, default:'media/profilePicture.png'},
    createdAt: {type: Date, default: Date.now}
})



module.exports = Teacher

