import { Invite, User } from "../Modals/modal.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import {z as zod} from "zod";


export const access_cookie={httpOnly:true,maxAge:24*60*60*1000,sameSite:"None",secure:true,path:'/'};
export const refresh_cookie={httpOnly:true,maxAge:5*24*60*60*1000,sameSite:"None",secure:true,path:'/'}


export const login=async(req,res)=>{
const {email,password}=req.body;
if(!email||!password){
    return res.status(400).json({msg:"invalid credentials"});
}


try {
const user=await User.findOne({email});
if(!user){
    return res.status(400).json({msg:"invalid credentials"});
}
    const compared=await bcrypt.compare(password,user.password);
    if(!compared){
        return res.status(400).json({msg:"invalid credentatail"});
    };
const access_token=  jwt.sign({email,userId:user._id},process.env.SECRET_KEY,{expiresIn:"1d"});
const token=  jwt.sign({email,userId:user._id},process.env.SECRET_KEY,{expiresIn:"5d"});
res.cookie("access_token",access_token,access_cookie);
res.cookie("refresh_token",token,refresh_cookie);

    res.status(200).json({msg:"user logged in succesfully",access_token,userId:user._id});
} catch (error) {
    
    res.status(500).json({msg:"internal server erro",error})
}

};


export const signup=async(req,res)=>{
    const {email,password,fullname}=req.body;
 if(!email||!password||!fullname){
    return res.status(400).json({msg:"invalid credentials"})
 }

    try {
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({msg:"user already registered"});
        }
  const salt=await bcrypt.genSalt(10);
  const hashedPassword=await bcrypt.hash(password,salt);
const user=await User.create({email,password:hashedPassword,fullname});
const access_token=  jwt.sign({email,userId:user._id},process.env.SECRET_KEY,{expiresIn:"1d"});
const token=  jwt.sign({email,userId:user._id},process.env.SECRET_KEY,{expiresIn:"5d"});
res.cookie("access_token",access_token,access_cookie);
res.cookie("refresh_token",token,refresh_cookie);

    res.status(200).json({msg:"user logged in succesfully",access_token,userId:user._id});

    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"internal server error",error});
    }
};





export const sendInvitaiton=async(req,res)=>{
const userId=req.userId;
const {emails}=req.body;
const zodSchema=zod.array();
try {
    zodSchema.parse(emails);


const users=await User.find({
    email:{$in:emails}
});
if(users.length==0){
return res.status(400).json({msg:"no such users exists"})
}
const to=users.map(user=>({userId:user._id.toString(),seen:false}));
console.log(to);
    const invitation=await Invite.create({
        by:userId,
        to,
    
    });
    res.status(200).json({msg:"Invitaion sent"});

} catch (error) {
    if(error instanceof zod.ZodError || error?.name==="ZodError"){
        return res.status(400).json({msg:"invalid emails"})
    }
    res.status(500).json({msg:"internal server errror"})
}


};


export const getAllInvitaions=async(req,res)=>{
const userId=req.userId;
const invitaions=await Invite.find({
    to:{
        $elemMatch:{
            userId
        }
    }
});
// console.log(invitaions)
res.status(200).json(invitaions);
};



export const logout=async(req,res)=>{
    // console.log("hiiiii")
    // console.log(req.cookies)
    // console.log("ia m fine")
    res.clearCookie("access_token", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        path: "/"
      });
      res.clearCookie("refresh_token", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        path: "/"
      });
      res.status(200).json({msg:"logged out successfully"})
    }