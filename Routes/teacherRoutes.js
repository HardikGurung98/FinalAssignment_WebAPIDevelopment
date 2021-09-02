
// file userRoute.js

const express = require('express');
const Teacher = require('../Models/teacherModel');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/upload');
const isTeacherLoggedIn = require('../middleware/auth');





// Teacher Register
router.post('/account/register/teacher', upload.single('profilePicture'),
[
    check('username', 'required username').not().isEmpty(),
    check('email', 'Invalid Email Address').isEmail(),
    check('email', 'Invalid Email Address').not().isEmpty(),
    check('password', 'password is required').not().isEmpty()
], function(req,res)

{
    // console.log('hello', req.file)
    // if (!req.file) {
    //     return res.send('Please upload a file')  
    // }   
    
    const errors = validationResult(req);
    
    if(errors.isEmpty())
    {

        const username = req.body.username
        const password = req.body.password
        const email = req.body.email
        // const profilePicture = req.body.profilePicture


        console.log(username)
        // console.log(profilePicture)


        bcryptjs.hash(password, 10, function(err, hash)
        {
            const addTeacher = new Teacher({username:username, password:hash, email:email})

            addTeacher.save().then(function(result)
            {
                res.status(201).json({message : "account registred success", success:true})
                console.log("teacher registred")
            })
            .catch(function(err)
            {
                res.status(500).json({message : err})
                console.log("teacher register failed")
            })
        });


        
    }
    else
    {
        res.status(400).json(errors.array());
        console.log("fail")
    }

    
})



// Teacher Login


router.post('/account/login/teacher', function(req, res)
{
   const username =  req.body.username
   const password = req.body.password
   // now we need to find if the user exists
   console.log(username)
   console.log(password)
   Teacher.findOne({username : username})
   .then(function(teacherData)
   {
       console.log(teacherData)
       console.log(teacherData.username);

       if(teacherData === null)
       {
           // username is does not exist
           return res.status(201).json({message : "Invalid login data11", success : false});
       }


    // password checking process
    bcryptjs.compare(password, teacherData.password, function(err, result)
    {
        console.log(result);
        if(result === false)
        {
            return res.status(201).json({message : "Invalid login data"});
        }

        const token = jwt.sign({teacherId : teacherData._id}, 'secretkey');
        res.status(200).json({
            message : "Auth acess", 
            token : token,
            success:true,
            teacherData:teacherData,
            user:"Teacher"
        })

        console.log("Correct");
    })
   })
   .catch(function(e){
        res.status(500).json({error : e, success : false})
})
})

// Teacher Profile

router.get('/account/teacher/profile', isTeacherLoggedIn.isTeacherLoggedIn, function(req, res){
    const id = req.tinfo._id;
    // console.log(id)
    Teacher.findOne({_id : id}).then(function(data){
        res.status(200).json(data)
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })
})


// Teacher profile update
router.put('/account/teacher/update', isTeacherLoggedIn.isTeacherLoggedIn, upload.single('profilePicture'), function(req, res)
{
    const id = req.tinfo._id
    const username = req.body.username
    const email = req.body.email
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const bioGraphy = req.body.bioGraphy
    const website = req.body.website
    const linkin = req.body.linkin
    const youtube = req.body.youtube
    const profilePicture = req.file.path

    Teacher.updateOne({_id:id, username:username, email:email, firstName:firstName,
                        lastName:lastName, bioGraphy:bioGraphy, website:website, linkin:linkin,
                        youtube:youtube, profilePicture:profilePicture})
    .then(function(result)
    {
        console.log(result)
        res.status(200).json({ message : "Teacher profile successfully updated", success : true })
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })

})


// Teacher pernamently delete account

router.delete('/account/teacher/delete', isTeacherLoggedIn.isTeacherLoggedIn, function(req, res)
{
    console.log('url hitted');
    const id = req.tinfo._id
    Teacher.deleteOne({_id:id}).then(function(result)
    {
        res.status(200).json({ message : "Teacher account successfully deleted", success:true })
    })
    .catch(function(er){
        res.status(500).json({ message : er, success:false })
    })
})




module.exports = router;