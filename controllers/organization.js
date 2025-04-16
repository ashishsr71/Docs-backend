import { Invite, OrgDoc ,User} from "../Modals/modal.js";
import {z as zod} from "zod";

export const createOrganization=async(req,res)=>{
    const userId=req.userId;
    const {name}=req.body;
    const {fullname,email}=await User.findOne({_id:userId});
    const org=await OrgDoc.create({
        name,
        createdby:userId,
        participants:[{userId,role:"admin",fullname,email}],
        docs:[]  
    });
    
    res.status(200).json(org);
};

export const getOrganization=async(req,res)=>{
    const userId=req.userId;

    const organization=await OrgDoc.find({participants:{
        $elemMatch:{
            userId
        }
    }});
    // console.log("org"+organization)
 const user=await User.findOne({_id:userId});
    res.status(200).json([...organization,{userId,email:user.email,}]);
};


export const sendInvite=async(req,res)=>{
    const userId=req.userId;
    const {emails,orgId,name}=req.body;
    const zodSchema= zod.array(zod.string().email());
    try {
        zodSchema.parse(emails);

        const users=await User.find({ email: { $in: emails } });
  if(users.length>0){
    const invites=new Invite({by:userId,
        to:[],
        org:{orgId,name}
    });
users.forEach((user)=>{
    invites.to.push({userId:user._id,seen:false,imgUrl:user.imgUrl,
        fullname:user.fullname,email:user.email
    })
})
await invites.save();
  }
res.status(200).json({msg:"invites sent successfully"})
// console.log("no error tillnow")
    } catch (error) {
      console.log(error)
          if(error instanceof zod.ZodError || error?.name==="ZodError"){
                return res.status(400).json({msg:"invalid emails"})
            }
        res.status(400).json({msg:error?.message})
    }
      
};

export const getAllOrgUsers=async(req,res)=>{
    const {id}=req.params;
   const userId= req.userId;
    if(!id){
        return res.status(400).json({msg:"bad req"});
    }

    const org=await OrgDoc.findOne({_id:id});
    if(!org){
        return res.status(400).json({msg:"no such organization"});
    
    };

if(!org.participants.some(p=>p.userId==userId)){
    return res.status(400).json({msg:"not a member of organization"})
};


res.status(200).json(org.participants);



};

export const joinOrganization=async(req,res)=>{
    const userId=req.userId;
    const{orgId}=req.body;
    const r=await OrgDoc.findOne({_id:orgId});
if(!r){
    return res.status(400).json({msg:"no such organization"});


};
const user=await User.findOne({_id:userId});
r.participants.push({
    userId,
    role:'member',
    fullname:user.fullname,
    email:user.email
});
await r.save();

res.status(200).json({msg:"organization joined successfully"})

}