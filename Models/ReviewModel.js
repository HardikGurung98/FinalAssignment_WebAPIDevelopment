const mongoose = require('mongoose');



const Review = mongoose.model('Review', {
    content : {type:String, require:[true, 'review content is required']},
    course : {type : mongoose.Types.ObjectId, ref:'Course'},
    reviewedBy : {type : mongoose.Types.ObjectId, ref:'Student'},
})

module.exports = Review