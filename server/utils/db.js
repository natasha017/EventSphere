import mongoose from "mongoose";

const connectToDb=async(URI)=>{
    try {
        await mongoose.connect(URI)
        console.log("Database Connect Successfully")
    } catch (error) {
      console.log(error) 
      process.exit(1)
    }
}
export default connectToDb