
const User = require('../models/User');
const Course = require('../models/Course');

const stripe = require('stripe')(process.env.STRIPE_SECRET);

export const makeinstructor=async(req,res)=>{
    try{

        // find user from database 

    const user =await User.findById(req.user._id).exec()

    // if user dont have stripe account_id then creat new
    if (!user.stripe_account_id) {
        const account =await stripe.account.create({type:'express'})
        console.log(account)
        user.stripe_account_id=account.id
        user.save()

    }
    
    
    // creat accpunt  lonk base on id (for frontend)
    const accountLink =await stripe.accountLink.create({
        account:user.stripe_account_id,
        refresh_url:process.env.STRIPE_REDIRECT_URL,
        return_url:process.env.STRIPE_REDIRECT_URL,
        type:"account_onboarding",
    })
    
    // pre- fill any information such as email then send url response

    accountLink=Object.assign(accountLink,{
        "stripe_user[email]":user.email,
        
    })
    res.send(`${accountLink.url} ? ${queryString.stringfy(accountLink)}`)

    //then send the account link as respomsed 


    }
    catch(err){
        console.log(err)
    }

    }



    export const currentInstructor=async(req,res)=>{
        try{

            let user=await User.findById(req.usr._id).select('-password').exec();
            if(!user.role.includes('Instructor')){
                return res.status(403);
            }
            else{
                res.json({ok:true})
            }
        }catch(err){
            console.log(err);

        }
    }

export const getAccountStatus=async(req,res)=>{


    try{

        const user= await User.findById(req.user._id);
       const  account =await stripe.accounts.retrieve(user.stripe_account_id);
       console.log("account",account)
       if(!account.charges_enabled){
           res.status(403).send('Unauthorized')
       }
       else{
           const statusUpdate=await User.findByIdAndUpdate(user._id,
            {
                stripe_seller:account,
                $addToSet:{role:"Instructor"}
            },{new:true}).select('-password')
            res.json(statusUpdate)
       }

    }catch(err){
        console.log(err);
    }
}


export const instructorCourses=async (req,res)=>{
    try{


        const courses=await Course.find({instructor:req.user._id}).sort({createdAt:-1})
        res.json(courses);



    } catch(err){
        console.log(err);
    }
}