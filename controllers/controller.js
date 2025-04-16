import { Doc, OrgDoc } from "../Modals/modal.js";
import {z as zod} from "zod";



 export const createDoc=async(req,res)=>{
    const {docName,type,organizationId,initalContent}=req.body;
    const zodSchema=zod.string();
    const userId=req.userId;
// console.log(type)
    if(type!=="personal"&&type!=="organization"){
        return res.status(400).json({msg:"invalid doc type"})
    };
     
  try {
    if(!docName){
        return res.status(400).json({msg:"title required"});
    };
    zodSchema.parse(docName);
    zodSchema.parse(initalContent);
   if(organizationId&&type=="organization"){
    const org=await OrgDoc.findOne({_id:organizationId});
    if(!org.participants.some(p=>p.userId==userId)){
        return res.status(400).json({msg:"unauthorized member"})
    }
    if(org){
        const newd=await Doc.create({type,
            userId,content:initalContent,title:docName,
        });
        org.docs.push(newd._id);
        await org.save();
        return res.status(200).json(newd);
    }
   }
const doc=await Doc.create({
title:docName,
userId,
content:initalContent,
type
})

res.status(200).json(doc);
  } catch (error) {
    if(error instanceof zod.ZodError || error?.name==='ZodError'){
        return res.status(400).json({msg:"invalid name"})
    }else{
        return res.status(500).json({msg:"internal server error"})
    }
  }


 }  ;



export const saveDoc=async(req,res)=>{
    const {id}=req.params;
    const content=req.body;
   const zodSchema=zod.string()
   try {
    zodSchema.parse(content);
    const doc=await Doc.updateOne({_id:id},{
        content
    });

    res.status(200).json({msg:"saved",doc});
   } catch (error) {
    if(error instanceof zod.ZodError||error?.name==="ZodError"){
        return res.status(400).json({msg:"invalid content"});
    }else{
        return res.status(500).json({msg:"internal server"});
    }
   };
   
};


export const getAllDocs=async(req,res)=>{
    const   userId=req.userId;
    const {role}=req.query;
    if(role==userId){
        const docs=await Doc.find({userId,type:"personal"});
   return res.status(200).json({docs});
    }
    const org=await OrgDoc.findOne({_id:role});
    if(org&&org.participants.some(p=>p.userId==userId)){
        const docs=await Doc.find({_id:{$in:org.docs}})
        return res.status(200).json({docs});
        
    }
    const docs=await Doc.find({userId,type:"organization"});
    res.status(200).json({docs});
};




export const getDocContent=async(req,res)=>{
    const {id}=req.params;
    const userId=req.userId;
    if(!id){
        return res.status(400).json({msg:"invalid or no doc id"});
    };
const doc=await Doc.findOne({_id:id});

res.status(200).json(doc);

}