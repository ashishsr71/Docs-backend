import { model, Schema } from "mongoose";


const userSchema=new Schema({
email:String,
password:String,
imgUrl:String,
fullname:String
});

const docSchema=new Schema({
type:String,    
content:String,
userId:String,
title:String
},{timestamps:true});

const organizationSchema=new Schema({
    createdby:String,
    participants:[{userId:String,role:String,email:String,fullname:String}],
    docs:[{type:Schema.Types.ObjectId,ref:"Doc"}],
    name:String
})

const inviteSchema=new Schema({
    org:{orgId:String,name:String},
by:String,
to:[{userId:String,seen:Boolean,fullname:String,imgUrl:String,email:String}],
expiresAt:  { type: Date,  expires: 1440*6000 }
});


export const User=model("User",userSchema);
export const Doc=model("Doc",docSchema);
export const OrgDoc=model("OrgDoc",organizationSchema)
export const Invite=model("Invite",inviteSchema);
 