
import express from "express";

import cors from 'cors';
import {readdirSync} from 'fs';
import csrf from 'csurf';
const mongoose =require( "mongoose");
const morgan=require("morgan");
const cookieParser = require("cookie-parser");


 
require("dotenv").config();



const app=express();


// apply middleweares

app.use(cors());
app.use(express.json({limit:"5mb"}));


app.use(morgan("dev"));

app.use((req,res,next)=>{console.log('thhis is my own middleweaares')
next()
});


app.use(cookieParser())


//rout
readdirSync('./routers').map((r)=>{
    console.log('this is file read')
    console.log(r)
    app.use('/api' ,require(`./routers/${r}`))
    console.log('this is file')
})



app.use(csrf({ cookie: true }))

app.get('/api/csrf-token',(req,res)=>{
    console.log('thsi is csrf-token ')

    res.json({csrfToken:req.csrfToken()})
    res.locals.csrfoken = req.csrfToken()


})


// DB 
mongoose.connect(process.env.DATABASE,{

    useCreateIndex: true, 
    useFindAndModify: false, 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(()=>console.log('DB connect'))
.catch((err)=>console.log(err))


//port 

const port= process.env.PORT || 8000;


app.listen(port,()=>{
    console.log(`runniig in port ${port}`)
})

app.get('/check',(req,res,next)=>res.send('udemy backend'))