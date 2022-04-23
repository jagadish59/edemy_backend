import express from 'express';

const router=express.Router();

//middleware
import { requireSignin } from '../middlewares';

import {makeinstructor,currentInstructor ,getAccountStatus,instructorCourses} from  '../controllers/instructor';
router.post('/make-instructor',requireSignin,makeinstructor);
router.get('/current-instructor',requireSignin,currentInstructor);
router.post('/get-account-status',requireSignin,getAccountStatus);
router.get('/current-courses',requireSignin,instructorCourses)
module.exports=router;