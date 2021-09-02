const mongoose = require('mongoose');

const CourseEnroll = mongoose.model('CourseEnroll', {
    course : {type : mongoose.Types.ObjectId, ref:'Course'},
    enrolledBy : {type : mongoose.Types.ObjectId, ref:'Student'},
})

module.exports = CourseEnroll