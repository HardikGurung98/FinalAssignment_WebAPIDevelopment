const express = require('express');
const Student = require('../Models/studentModel');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isStudentoggedIn = require('../middleware/auth');
const upload = require('../middleware/upload');



// Student Register

router.post('/account/register/student', upload.single('profilePicture'),
[
    check('username', 'required username').not().isEmpty(),
    check('email', 'Invalid Email Address').isEmail(),
    check('email', 'Invalid Email Address').not().isEmpty(),
    check('password', 'password is required').not().isEmpty()

], function(req,res)
{
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const username = req.body.username
        const password = req.body.password
        const email = req.body.email

        bcryptjs.hash(password, 10, function(err, hash)
        {
            const addStudent = new Student({username:username, password:hash, 
                    email:email})  
            addStudent.save()
            .then(function(result)
            {
                res.status(201).json({message : "Account registred success", success:true})
                console.log('student registred success')
            })
            .catch(function(err)
            {
                res.status(500).json({message:err})
                console.log('student regristration failed')
            })
        })  
    }
    else
    {
        res.status(400).json(errors.array());
    }   
})


// student login
router.post('/account/login/student', function(req, res)
{
    const username = req.body.username
    const password = req.body.password
    console.log(username)
    console.log(password)

    Student.findOne({username : username})
    .then(function(studentData)
    {
        if(studentData === null)
        {
            return res.status(201).json({message : "Invalid login data", success:false})
        }

        bcryptjs.compare(password, studentData.password, function(err, result)
        {
            if(result === false)
            {
                return res.status(201).json({message : "Invalid login data", success:false})
            }

            const token = jwt.sign({studentId : studentData._id}, 'secretkey')
            res.status(200).json({
                message : "Login Sucessful",
                token : token,
                success:true,
                studentData:[studentData],
                user:"Student",
                username : req.body.username
            })
            console.log(token)
        })
    })
    .catch(function(err)
    {
        res.status(500).json({message:err})
    })
})


// student profile

router.get('/account/student/profile', isStudentoggedIn.isStudentoggedIn, function(req, res){
    const id = req.sInfo._id
    Student.findOne({_id : id}).then(function(data){
        res.status(200).json(data)
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })
})



// student profile update
router.put('/account/student/update', isStudentoggedIn.isStudentoggedIn, upload.single('profilePicture'), function(req, res)
{
    const id = req.sInfo._id
    const username = req.body.username
    const email = req.body.email
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const bioGraphy = req.body.bioGraphy
    const profilePicture = req.file.path


    Student.updateOne({_id:id}, {username:username, email:email, firstName:firstName,
                        lastName:lastName, bioGraphy:bioGraphy, profilePicture:profilePicture})
    .then(function(result)
    {
        console.log(result)
        res.status(200).json({ message : "Student profile successfully updated", success : true })
    })
    .catch(function(e){
        res.status(500).json({error : e, success:false})
    })

})

// Student pernamently delete account

router.delete('/account/student/delete', isStudentoggedIn.isStudentoggedIn, function(req, res)
{
    const id = req.sInfo._id
    Student.deleteOne({_id:id}).then(function(result)
    {
        res.status(200).json({ message : "Teacher account successfully deleted", success:true })
    })
    .catch(function(er){
        res.status(500).json({ message : er, success:false })
    })
})

module.exports = router;