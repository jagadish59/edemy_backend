const User=require('../models/User');
const Course = require('../models/Course');
import slugify from 'slugify';



export const uploadImage= async(req,res)=>{

    const {image} =req.body;


    
    res.status(200).send('image uplaod success fully to firebase');

     
}


export const create=async (req,res)=>{
    try{



        
        const alreadyexit =await  Course.findOne({slug:slugify(req.body.name.toLowerCase())})
        
        if(alreadyexit){return res.status(400).send('This title is already exit')}

        const course= await new Course({
            slug:slugify(req.body.name),
            instructor:req.user._id,
            ...req.body,

        })

        await course.save();
        return res.status(200).send('cource crated')


    }catch(err){
        console.log(err)
        return res.status(400).send("Course creat failed try again");
    }
}


export const read=async (req,res)=>{

    try {

        const data=await Course.findOne({slug:req.params.slug}).populate('instructor','_id name').exec()
    
        return res.json(data);

    }catch(err){
        console.log(err);
    }
}



export const addLesson=async(req,res)=>{


    try{
        const {values,video} = req.body
        const {slug,instructorId}=req.params

    
    
        if(req.user._id!=instructorId){
            return res.status(400).send('unauthorized')
            
        }

        const update= await Course.findOneAndUpdate({slug:slug},{$push:
            {lessons:
                {title:values.title,content:values.content,video:video,slug:slugify(values.title)}}},{new:true})


     return res.status(200).send(update)
    }catch(err){
        console.log(err);
        res.status(400).send('failed videos lesson')
    }
}


export const update= async(req,res)=>{
    try{

        const {slug}=req.params

        const course=await Course.findOne({slug})

        if(req.user._id!=course.instructor){
            return res.send('user is not authencate')

        }

        const update =await Course.findOneAndUpdate({slug},req.body,{new:true})


        res.json(update)





    }catch(err){
        console.log(err);
    }
}


export const removeLesson=async(req,res)=>{
    try{

        const {slug,lessonId}=req.params
        
        const course=await Course.findOne({slug})
        if(req.user._id!=course.instructor){
            return res.status(400).send('unauthorized ')
        }

        const updatecourse=await Course.findByIdAndUpdate(
            course._id,
            {$pull:{lessons:{_id:lessonId}},}).exec();

            res.json({ok:true}); 






    }catch(err){
        console.log(err)
    }
}




export const updateLesson=async(req,res)=>{

try{
    const{slug,instructorId}=req.params
    const {_id,title,content,video,free_preview}=req.body


    const course=await Course.findOne({slug})
    

    if(course.instructor[0]._id!=req.user._id){
        return res.status(401).send('unauthorized')
    }


    const data=await Course.updateOne({'lessons._id':_id},{

        $set:{
            'lessons.$.title':title,
            'lessons.$.content':content,
            'lessons.$.video':video,
            'lessons.$.free_preview':free_preview,
        }
    },{new:true})
    
    res.status(200).send({ok:true})
}
catch(err){
    console.log(err)
}



}


export const publish= async (req,res)=>{

    try{
        
        const {courseId}=req.params

        const course=await Course.findById(courseId).select("instructor")
        if(course.instructor[0]._id!=req.user._id){
            return res.status(400).send('unauthorized id')
        }

        const updated=await Course.findByIdAndUpdate(courseId,{published:true},{new:true})
        res.json(updated)



    }catch(err){
        console.log(err)
    }
}


export const unpublish=async (req,res)=>{

    try{

        const {courseId}=req.params

        const course=await Course.findById(courseId).select("instructor")
        if(course.instructor[0]._id!=req.user._id){
            return res.status(400).send('unauthorized id')
        }
        
        const updated=await Course.findByIdAndUpdate(courseId,{published:false},{new:true})
        res.json(updated)



    }catch(err){
        console.log(err)
    }
}


export const courses =async(req,res)=>{

    const  all = await Course.find({published:true}).populate('instructor','name _id').exec()

    res.json(all);

}

export const checkEnrollment=async(req,res)=>{


    try{
        const {courseId}=req.params;
        console.log(courseId)
        const user=await User.findById(req.user._id)
        //check if id is found in user courses
        let ids=[]
        let length=user.courses && user.courses.length;
        for(let i=0;i<length;i++){
            console.log(courseId)
            ids.push(user.courses[i].toString())
    
        }
        res.json({
            status:ids.includes(courseId),
            courses:await Course.findById(courseId).exec()
        })

    }
    catch(err){console.log(err)}


}

export const freeEnrollment=async(req,res)=>{

    try{

        // check is course is free or not
        const course=await Course.findById(req.params.courseId)

        if(course.paid)return

        const result= await User.findByIdAndUpdate(req.user._id,{
            $addToSet:{courses:course._id},
            

        },{new:true})

        res.json({
            message:"congratulation your free enroll success",
            course:course
        })

    }
    catch(err){
        console.log(err)
        res.status(400).send('enroll filed')
    }

}
export const paidEnrollment=async(req,res)=>{
    try{

    }
    catch(err){
        console.log(err)
        
    }
}


export const userCourses=async(req,res)=>{
    try{
        const user=await User.findById(req.user._id)
        const courses=await Course.find({_id:{$in:user.courses}}).populate("instructor","_id name")
        res.json(courses);

    }
    catch(err){
        console.log(err);
    }
}