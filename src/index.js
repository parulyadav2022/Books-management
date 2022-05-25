const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const {default:mongoose} = require('mongoose');
const app = express();
const multer = require('multer');
const { appConfig} = require('aws-sdk');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }))
app.use(multer().any())


mongoose.connect('mongodb+srv://parulyadav2022:functionup2022@cluster0.nnpfr.mongodb.net/group01Database',{
    useNewUrlParser : true})

.then( () => console.log("Mongodb is connected"))
.catch( err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function()  {
    console.log('Express app running on Port' + (process.env.PORT || 3000))
});