const express = require('express');
const Admin = require('../Models/adminModel');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/upload');



// Student Register

router.post('/admin/register', function(req,res)
{

    const username = 'admin'
    const password = 'admin1530'
    const email = 'elearn.admin@gmail.com'

    bcryptjs.hash(password, 10, function(err, hash)
    {
        const addAdmin = new Admin({username:username, password:hash, 
                    email:email})  
        addAdmin.save()
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

})





// admin login
router.post('/admin/login', function(req, res)
{
    const username = req.body.username
    const password = req.body.password
    console.log(username)
    console.log(password)

    Admin.findOne({username : username})
    .then(function(adminData)
    {
        if(adminData === null)
        {
            return res.status(201).json({message : "Invalid login data", success:false})
        }

        bcryptjs.compare(password, adminData.password, function(err, result)
        {
            if(result === false)
            {
                return res.status(201).json({message : "Invalid login data", success:false})
            }

            const token = jwt.sign({adminData : adminData._id}, 'secretkey')
            res.status(200).json({
                message : "Login Sucessful",
                token : token,
                success:true,
                user:"Admin",
            })
            console.log(token)
        })
    })
    .catch(function(err)
    {
        res.status(500).json({message:err})
    })
})


module.exports = router
