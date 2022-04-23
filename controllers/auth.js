const User = require('../models/User');
import jwt from 'jsonwebtoken';
import {nanoid} from 'nanoid';
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "jagadishkhadka.jk@gmail.com",
    pass: process.env.PASS
  }
});

import { hashPassword, comparePassword } from '../util/auth';

export const register = async (req, res) => {


  try {

    const { name, email, password } = req.body;
    console.log('call register dab')

    if (!name) return (res.status(400).send('Name is required'))
    if (!password || password.length < 6) {

      return res.status(400).send("password  is required and shoud be min 6 character long ");

    }
    let UserExist = await User.findOne({ email: email });

    if (UserExist) return res.status(400).send("Email is Alredy taken")
    console.log('call register before user')
    const hashpassword1 = await hashPassword(password);
    console.log('call register before user')
    //Register
    const user = new User({
      name,
      email,
      password: hashpassword1,

    })
    await user.save();
    console.log("saved User ")
    return res.status(200).send("user is creat. login with this account")

  }
  catch (err) {
    console.log(err)
    return res.status(400).send('Error try agein.');

  }


}


export const login = async (req, res) => {
  try {

    const { email, password } = req.body;
    const user = await User.findOne({ email: email })
    if (!user) return res.status(400).send("no user found")
    const match = await comparePassword(password, user.password)
    if(!match) return res.status(400).send(" wrong Password")
    const token = jwt.sign({ _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" })
    user.password = undefined;
    res.cookie("token", token, {

      httpOnly: true,
      // secure:true


    })
    res.json(user);


  }
  catch (err) {
    console.log(err)
    return res.status(400).send("error try again")
  }
}


export const logout = async (req, res) => {

  try {
    res.clearCookie('token')
    return res.json({ message: 'Logout successifully' })


  }
  catch (err) {

    console.log(err)
  }


}


export const currentUser = async (req, res) => {
  try {

    const user = await User.findById(req.user._id).select("-password");

    console.log('');
    return res.json({ok:true});




  }
  catch (error) {
    console.log(error)
  }
}

export const  fogetPassword=async(req,res)=>{
  try{

    const {email}=req.body
    const shortCode=nanoid(6).toUpperCase();
    const user=await User.findOneAndUpdate(
      {email},{passwordResetCode:shortCode}
    );
    if(!user)return res.status(400).send('user not found')


    transporter.sendMail({
      to:email,
      from:"jagadishkhadka.jk@gmail.com",
      subject:"password reset",
      html:`<html>
      <h1>Reset password</h1>
      <p> User this code to reset password</P>
      <h2 style="color:red;"> ${shortCode}</h2>
      </html>
      `
    })
    res.json('check your email')

    
    

  }
  catch(err){
    console.log(err);
  }

}



export const resetPassword=async(req,res)=>{
  try{

    const {email,code,newpassword}=req.body;

    const hashpassword1 = await hashPassword(newpassword);

    const {user} =await User.findOneAndUpdate({email:email,passwordResetCode:code},
      {password:hashpassword1,passwordResetCode:""});
    res.json({ok:true})




  }
  catch(err){
    console.log(err)
    return (res.status(400).send(err))
  }

}