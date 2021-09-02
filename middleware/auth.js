const jwt = require('jsonwebtoken')

const Teacher = require('../Models/teacherModel')
const Student = require('../Models/studentModel')
const Admin = require('../Models/adminModel')


// file auth.js


module.exports.isTeacherLoggedIn = function(req, res, next)
{
    // console.log('test')

    const token = req.headers.authorization.split(' ')[1]
    console.log(token)
    if (!token) {
        return res.status(401).send('Access denied')
        
    }
    try {
        const checkTeacherData = jwt.verify(token, 'secretkey')

        Teacher.findOne({_id:checkTeacherData.teacherId})
        .then(function(teacherinfo)
        {
            // console.log(teacherinfo)
            req.tinfo = teacherinfo
           // res.send(teacherinfo)
            next()
        })
       
        .catch(function(err)
        {
            res.status(401).json({message:"please login first as a teacher"})
            console.log('Invalid token console')
        })

        
    } catch (err) {
        res.status(500).json({error : err})
    }

}




module.exports.isStudentoggedIn = function(req, res, next)
{
    console.log('student test middleware')

    console.log('hello ', req.headers.authorization)

    const token = req.headers.authorization.split(' ')[1]
    console.log('student token',token)
    if (!token) {
        return res.status(401).send('Access denied')
    }
    try 
    {
        const checkStudentData = jwt.verify(token, 'secretkey')

        Student.findOne({_id:checkStudentData.studentId})
        .then(function(studentInfo)
        {
            console.log('student information ',studentInfo)

            req.sInfo = studentInfo

            console.log(req.sInfo._id)
           // res.send(teacherinfo)
            next()
        })
       
        .catch(function(err)
        {
            res.status(401).json({message:"please login first as a student"})
            console.log('Invalid token console')
        })

        
    } catch (err) {
        res.status(500).json({error : err})
    }

}




module.exports.isAdminLoggedIn = function(req, res, next)
{
    // console.log('test')

    const token = req.headers.authorization.split(' ')[1]
    console.log(token)
    if (!token) {
        return res.status(401).send('Access denied')
        
    }
    try {
        const checkAdminData = jwt.verify(token, 'secretkey')

        Teacher.findOne({_id:checkAdminData.adminId})
        .then(function(adminInfo)
        {
            // console.log(teacherinfo)
            req.aInfo = adminInfo
           // res.send(teacherinfo)
            next()
        })
       
        .catch(function(err)
        {
            res.status(401).json({message:"please login first as a admin"})
            console.log('Invalid token console')
        })

        
    } catch (err) {
        res.status(500).json({error : err})
    }

}

