const express = require('express');
const router = express.Router();
const Course = require('../Models/courseModel');
const Enroll = require('../Models/CourseEnrollModel');
const isStudentoggedIn = require('../middleware/auth');


router.post('/enroll/course/:id', isStudentoggedIn.isStudentoggedIn, function(req,res)
{
    console.log('enroll url hitted');

    const enrolledBy = req.sInfo._id
    const course = req.params.id
    


    const enroll = new Enroll({course:course, enrolledBy:enrolledBy})

    enroll.save().then(function(result)
    {
        res.status(201).json({message:"course enrolled successsfulley", success:true})

    })
    .catch(function(err)
    {
        res.status(500).json({message:err, success:false})
    })
})



router.get('/enrolles/:id', function(req, res)
{
    const courseID = req.params.id

    Enroll.find({course:courseID}).then(function(data){
        res.status(200).json(data)
        // console.log('data log',data)
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })
})





router.get('/already/enrolled/:id', isStudentoggedIn.isStudentoggedIn, function(req, res)
{
    const course = req.params.id
    const enrolledBy = req.sInfo._id


    Enroll.aggregate([{$match:{courseID:course}}])
    .then(function(data){
        res.status(200).json({data, message:"already enrolled this course"})
        console.log('data log',courseID)
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })
})





router.get('/get/enrolled/courses', isStudentoggedIn.isStudentoggedIn, function(req, res)
{
    const id = req.sInfo._id
    Enroll.find({enrolledBy:id}).populate("course").then(function(data)
    {
        res.status(200).json({success : true, data})

        console.log(data)
    })
    .catch(function(e)
    {
        res.status(500).json({error:e})
    })
})


router.delete('/delete/my-enroll/:id', isStudentoggedIn.isStudentoggedIn, function(req, res)
{
    const id = req.params.id
    Enroll.deleteOne({_id:id}).then(function(result)
    {
        res.status(200).json({message:"enroled course deleted success" , success:true})
    })
    .catch(function(er)
    {
        res.status.json({message:er, success:false})
    })

})




router.delete('/enrolled/courses/deleteOnAccount', isStudentoggedIn.isStudentoggedIn, function(req, res){
    const id = req.sInfo._id

    console.log(req.sInfo.username)
    console.log(req.sInfo._id)

    console.log(id)

    Enroll.deleteMany({enrolledBy : id}).then(function(){
        res.status(200).json({success : true, message : 'deleted all review'})
    })
    .catch(function(err){
        res.status(500).json({success : false, message : err})
    })          
})



module.exports = router