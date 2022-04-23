import express from 'express';

const router=express.Router();

//middleware
import { requireSignin ,isInstructor,isEnroll} from '../middlewares';

//controller 
import {uploadImage,create,read,addLesson,update,
    removeLesson,updateLesson,publish,unpublish,
    courses,checkEnrollment,freeEnrollment,paidEnrollment,userCourses} from '../controllers/course';
//image 
router.post('/course/upload-image',uploadImage)



//user  

router.get('/courses',courses)
// course

router.post("/course",requireSignin,isInstructor,create)
router.put('/course/:slug',requireSignin,update)
router.get('/course/:slug' ,read)

//publish unpublish
router.put('/course/publish/:courseId',requireSignin,publish)
router.put('/course/unpublish/:courseId',requireSignin,unpublish)


router.put('/course/:slug/:lessonId',requireSignin,removeLesson)
//add lesson
router.post('/course/lesson/:slug/:instructorId',requireSignin,addLesson)
router.put('/course/lesson/:slug/:instructorId' , requireSignin,updateLesson)
router.get('/check-enrollment/:courseId',requireSignin,checkEnrollment)
router.post('/free-enrollment/:courseId',requireSignin,freeEnrollment)

router.post('/paid-enrollment/:courseId',requireSignin,paidEnrollment)

router.get('/user/course/:slug',requireSignin,isEnroll ,read)

//user course
router.get('/user-courses',requireSignin,userCourses)
module.exports=router;