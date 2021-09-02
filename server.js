const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');

const path = require('path');

const media = path.join(__dirname, '')

const db = require('./Database/db')

const teacherRoute = require('./Routes/teacherRoutes')
const studentRoute = require('./Routes/studentRoute')
const course = require('./Routes/courseRoute');
const review = require('./Routes/ReviewRoute');
const enroll = require('./Routes/EnrollRoute');
const adminRoute = require('./Routes/adminRoute')


var app = express();
app.use(express.static(media))

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))

app.use(express.json())

app.use(teacherRoute);
app.use(studentRoute);
app.use(adminRoute);
app.use(course);
app.use(review);
app.use(enroll);


app.listen(1337);

