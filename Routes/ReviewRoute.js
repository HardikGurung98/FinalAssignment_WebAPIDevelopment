const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator')
const Course = require('../Models/courseModel');
const Review = require('../Models/ReviewModel')
const isStudentoggedIn = require('../middleware/auth');




// Creating Review

router.post('/review/post/:id', isStudentoggedIn.isStudentoggedIn,  function(req, res)
{
    const content = req.body.content
    const course = req.params.id
    const reviewedBy = req.sInfo._id

    const review = new Review({content:content, course:course, reviewedBy:reviewedBy})

    review.save().then(function(result)
    {
        res.status(201).json({message:"course reviewed successsfulley"})

    })
    .catch(function(err)
    {
        res.status(500).json({message:err})
    })
})


router.get('/reviews/:id', function(req, res)
{
    const courseID = req.params.id

    Review.find({course:courseID}).populate('reviewedBy'). then(function(data){
        res.status(200).json(data)
        // console.log('data log',data)
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })
})


router.delete('/reviews/deleteOnAccount', isStudentoggedIn.isStudentoggedIn, function(req, res){
    const id = req.sInfo._id

    console.log(req.sInfo.username)
    console.log(req.sInfo._id)

    console.log(id)

    Review.deleteMany({reviewedBy : req.sInfo._id}).then(function(){
        res.status(200).json({success : true, message : 'deleted all review'})
    })
    .catch(function(err){
        res.status(500).json({success : false, message : err})
    })          
})



module.exports = router