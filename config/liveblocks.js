import { Liveblocks } from "@liveblocks/node";
import { Doc, OrgDoc, User } from "../Modals/modal.js";
import { config } from "dotenv";
import mongoose from "mongoose";
config();


const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_KEY,
});





export const authEndPoint=async(req,res)=>{
  const userId=req.userId;
  const {id}=req.params;
  // const user = await User.findOne({_id:userId});
// console.log(user)
  // // Start an auth session inside your endpoint
  const organization=await OrgDoc.findOne({
    "participants.userId": userId,
    docs: { $in: [new mongoose.Types.ObjectId(id)] }
  });
  // console.log(organization)
  const document=await Doc.findOne({userId,_id:id});
  if(!document&&!organization){
    res.status(400);
  };
  
 const {fullname,imgUrl}=await User.findOne({_id:userId})  ;
  const session = liveblocks.prepareSession(
userId,
    { userInfo: {userId,fullname,imgUrl,avatar:imgUrl,name:fullname,} },  // Optional
  );
// console.log(session);
  // // Use a naming pattern to allow access to rooms with wildcards
  // // Giving the user read access on their org, and write access on their group
  // session.allow(`${userId}:*`, session.READ_ACCESS);
  session.allow(id, session.FULL_ACCESS);

  // // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return res.status(status).end(body);
}