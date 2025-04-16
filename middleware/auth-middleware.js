import jwt from "jsonwebtoken";

export const auth=(req,res,next)=>{
    const access_token=req.cookies.access_token||req.headers.access_token;
    if(!access_token){
        return res.status(401).json({msg:"unauthorized"})
    }
    try {
        const decoded=jwt.verify(access_token,process.env.SECRET_KEY);
        if(!decoded){
            return res.status(401).json({msg:"unauthorised"});
        };
    const {userId,email}=decoded;
    req.userId=userId;
    req.email=email;
    next();
    } catch (error) {
        res.status(401).json({msg:"unauthorise"})
    }

};
