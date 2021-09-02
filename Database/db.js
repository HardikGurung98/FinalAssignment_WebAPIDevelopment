const mongoose = require('mongoose');


// connecting mongo database

mongoose.connect('mongodb://127.0.0.1:27017/E-kakshya',
{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});