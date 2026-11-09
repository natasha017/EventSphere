import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const authMiddleware=async(req,res,next)=>{
   try {
    const token= req.cookies.token

    if(!token){
        return res
        .status(401)
        .json({message:"Unauthorized. Please Login First"})
    }

    const isVerified=jwt.verify(token,process.env.JWT_SECRET)
    const userData=await User.findOne({email:isVerified.email}).select({password:0})

    req.user=userData
    req.token=token
    req.userId=userData._id
    
    next()
   } catch (error) {
    next(error)
   } 
}

export default authMiddleware