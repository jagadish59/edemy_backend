import mongoose from 'mongoose';

const { Schema } = mongoose;
const userSchema = new Schema({

    name:{
        type:String,
        trim:true,
        require:true
    },
    email:{
        type:String,
        trim:true,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        min:6,
        max:64
    },
    picture:{
        type:String,
        default:"/avatar.png",

    },
    role:{
        type:[String],
        default:["Subscriber"],
        enum:["Subscriber","Instructor","Admin"],

    },

    passwordResetCode:{
        data:String,
        default:"",
    },
    courses:[{type:[mongoose.Schema.Types.ObjectId],ref:'Course'}],

    stripe_account_id:"",
    stripe_seller:{}, 
    stripeSession:{}



} , {timestamps:true})
 const User = mongoose.model('user', userSchema);

 module.exports=User;
