import mongoose from 'mongoose';

const lessonSchema= new mongoose.Schema({

  title:{
      type:String,
      trim:true,
      minlength:3,
      maxlength:320,
      require:true,


  },
  slug:{
      type:String,
      lowercase:true,

  },
  content:{
      type:String,
      minlength:200,


  },
  video:'',
  free_preview:{
      type:Boolean,
      default:false,
  },




},
{timestamps:true}
);


const courseSchema=new mongoose.Schema({

    
  name:{
    type:String,
    trim:true,
    minlength:3,
    maxlength:320,
    require:true,


},
slug:{
    type:String,
    lowercase:true,

},
description:{
    type:String,
    minlength:2,
    required:true,


},
price:{
    type:Number,
    default:9.99,
},

image:{},
catagory: String,
published:{
    type:Boolean,
    default:false,
},
paid:{
    type:Boolean,
    default:true,
},
instructor:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:"user",
    required:true

},
lessons:[lessonSchema],


},{timestamps:true})


const Course = mongoose.model('course', courseSchema);


module.exports=Course;