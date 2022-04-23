import  expressJwt  from 'express-jwt';
const User = require('../models/User');
const Course = require('../models/Course');



export const requireSignin=expressJwt({
    

    getToken:(req,res)=>req.cookies.token,
    secret:process.env.JWT_SECRET,
    algorithms:['HS256']
})

export const isInstructor=async (req,res,next)=>{

    try{
        const user=await User.findById(req.user._id).exec();
    if(user.role.includes("Instructor")){
        return res.sendStatus(403);
    } else{
        next()
    }
    } catch(err){
        console.log(err);
    }

}
export const isEnroll=async(req,res,next)=>{
    try{

        const user=await User.findById(req.user._id)
        const course=await Course.findOne({slug:req.params.slug})
        /// check for course id is found or array

        let ids=[]
        let length=user.courses.length
        for(let i=0; i<length;i++){
            ids.push(user.courses[i].toString())

        }

        if(!ids.includes(course._id.toString())){
            res.sendStatus(403);

        }else{
            next()
        }
    }
    catch(err){
        console.log(err);
    }
}