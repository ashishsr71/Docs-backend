import express from  "express";
import { connectDb } from "./config/database.js";
import { config } from "dotenv";
import { router } from "./routes/docs-router.js";
import { userRouter } from "./routes/userRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { orgRouter } from "./routes/organization.js";
import { authEndPoint } from "./config/liveblocks.js";
import { auth } from "./middleware/auth-middleware.js";

config();
console.log(process.env.FRONTEND_URL)


const app=express();
app.use(cors({
    origin:process.env.FRONTEND_URL, 
    credentials: true,
  }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/user",router);
app.use("/api/v1/user",userRouter); 
app.use("/api/v1/org",orgRouter)

app.post('/api/v1/liveblocks-auth/:id',auth,authEndPoint);

connectDb().then((r)=>{

}).catch(err=>{
    console.log(err);
})





const port=process.env.PORT||4000

app.listen(port,()=>{
    console.log("server is listen on 3000");
});