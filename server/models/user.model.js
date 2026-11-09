import { Schema,model } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
//userSchema
const userSchema=new Schema({
    username:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    passwordResetToken : {type : String},
    passwordResetExpires : {type : Date},
    role:{type:String,enum:["admin","exhibitor","attendee"],default:"attendee",},
    
},{timestamps:true})

// password hash
userSchema.pre("save", async function () {
    const user=this
    if(!user.isModified("password")){
       return 
    }
    try {
       const  saltRounds=await bcrypt.genSalt(10)
        const hashPassword=await bcrypt.hash(user.password,saltRounds)
        user.password=hashPassword
    } catch (error) {
      throw error
    }
})
//compare password
userSchema.methods.comparePassword= async function(password){
   try {
    return await bcrypt.compare(password,this.password) 
   } catch (error) {
    console.log(error)
   }

}
//jwt token 
userSchema.methods.generateToken=function(){
    try {
       return jwt.sign({
        userId:this._id.toString(),
        email:this.email,
        role:this.role,
    
    },process.env.JWT_SECRET,
    {expiresIn:"30d"}
) 
    } catch (error) {
       console.error(error)
    }
}

const User=model("user",userSchema)
export default User