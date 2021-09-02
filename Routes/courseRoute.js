const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator')
const Course = require('../Models/courseModel');
const upload = require('../middleware/upload');
const isTeacherLoggedIn = require('../middleware/auth');
const { route } = require('./teacherRoutes');
const Teacher = require('../Models/teacherModel');


// create course

router.post('/course/upload', 
isTeacherLoggedIn.isTeacherLoggedIn,
upload.fields(
    [
        {
            name:'courseThumbnail', maxCount:1
        },
        {
            name:'courseVideo', maxCount:1
        }
    ]
),

[
    check('courseTitle', 'required course title').not().isEmpty(),
    check('courseDesc', 'required course description').not().isEmpty()
],
function(req, res)
{
    console.log(req.files)

    const errors = validationResult(req);
    if (errors.isEmpty()){
        const teacherID = req.tinfo._id
        const courseTitle = req.body.courseTitle
        const courseDesc = req.body.courseDesc
        const courseThumbnail = req.files.courseThumbnail[0].path
        const courseVideo = req.files.courseVideo[0].path
        const coursePrice = req.body.coursePrice

        const course = new Course({ courseTitle:courseTitle, courseDesc:courseDesc, courseThumbnail:courseThumbnail,
                                    courseVideo:courseVideo, coursePrice:coursePrice, teacherID : teacherID })
        
        console.log(courseTitle)
        
        course.save().then(function(result)
        {
            res.status(201).json({message:"course upload success", success:true})

        })
        .catch(function(err)
        {
            res.status(500).json({message:err, success:false})
        })
    }
    else
    {
        res.status(400).json(errors.array());
        console.log("fail")
    }
})







// get all courses
router.get('/all-courses', function(req, res)
{
    Course.find().then(function(data)
    {
        res.status(200).json({data, success:true})
    })
    .catch(function(e)
    {
        res.status(500).json({error:e, success:false})
    })
})


// update course 
router.put('/course/update/:id', 
upload.fields(
    [
        {
            name:'courseThumbnail', maxCount:1
        },
        {
            name:'courseVideo', maxCount:1
        }
    ]
), isTeacherLoggedIn.isTeacherLoggedIn,
function(req, res)
{
    console.log(req.files)

    
    const id = req.params.id
    console.log('updating data ', id);
    const teacherID = req.tinfo._id

    const courseTitle = req.body.courseTitle
    const courseDesc = req.body.courseDesc
    const courseThumbnail = req.files.courseThumbnail[0].path
    const courseVideo = req.files.courseVideo[0].path
    const coursePrice = req.body.coursePrice

    Course.updateOne({_id : id},{courseTitle:courseTitle, courseDesc:courseDesc, coursePrice:coursePrice,
                    courseThumbnail:courseThumbnail, courseVideo:courseVideo })  
    .then(function(result)
    {
        // console.log(result)
        res.status(200).json({message:"Course updated", success : true})
    })
    .catch(function(e)
    {
        res.status(500).json({error:e})
        console.log('errrroooooorrrrr');
    })
})


// get one course
router.get('/course/:id', function(req, res)
{
    const id  = req.params.id


    // console.log(id)


    Course.findOne({_id:id}).then(function(data)
    {
        res.status(200).json(data)
    })

    .catch(function(e)
    {
        res.status(500).json({error : e, success:false})
    })
})




// delete one course

router.delete('/course/delete/:id', isTeacherLoggedIn.isTeacherLoggedIn, function(req, res)
{
    const id = req.params.id
    Course.deleteOne({_id:id}).then(function(result)
    {
        res.status(200).json({message:"course deleted success" , success:true})
    })
    .catch(function(er)
    {
        res.status.json({message:er, success:false})
    })
})



// get course by specific Teacher

router.get('/get/teacher/course', isTeacherLoggedIn.isTeacherLoggedIn, function(req, res)
{
    const id = req.tinfo._id;
    // console.log('teacherid', id)
    Course.find({teacherID : id}).then(function(data){
        res.status(200).json(data)
        // console.log('data log',data)
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })
})



router.delete('/courses/deleteOnAccount', isTeacherLoggedIn.isTeacherLoggedIn, function(req, res){
    const id = req.tinfo._id

    console.log(req.tinfo.username)
    console.log(req.tinfo._id)

    console.log(id)

    Course.deleteMany({teacherID : id}).then(function(){
        res.status(200).json({success : true, message : 'deleted all yoour courses'})
    })
    .catch(function(err){
        res.status(500).json({success : false, message : err})
    })          
})



module.exports = router