import express from 'express';

const router=express.Router();

//middleware
import { requireSignin } from '../middlewares';

import {register,login,logout,currentUser,fogetPassword,resetPassword} from  '../controllers/auth'
console.log('called router')

router.post("/register",register)
router.post("/login",login)
router.get('/logout',logout)
router.post('/forget-password',fogetPassword)
router.post('/reset-password',resetPassword)
router.get('/current-user',requireSignin,currentUser);
module.exports=router;