const express = require('express');
const {urlencoded, json} = require('express');
const router = require('./routes/routes.js');
const cors = require('cors');
const app = express();
const client= require ('./db/database.js');
// const mongoose = require ('./db/database.js')



app.use(urlencoded({extended: true}))
app.use(json())
app.use(cors())
app.use('/v1/restaurante', router);

app.listen(4000, ()=>{
    console.log('listening at port 4000');
})

