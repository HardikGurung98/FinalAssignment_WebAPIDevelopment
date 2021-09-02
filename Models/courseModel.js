const mongoose = require('mongoose');

const Course = mongoose.model('Course', {
    courseTitle : {type:String, require:[true, 'course title required']},
    courseDesc : {type:String, require:[true, 'course desc is required']},
    courseThumbnail: {type:String},
    courseVideo : {type:String},
    coursePrice :{type:Number, require:[true], default:0.00},
    teacherID: {type : mongoose.Types.ObjectId, ref:'Teacher'}
})

module.exports = Course