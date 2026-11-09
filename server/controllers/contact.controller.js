import Contact from "../models/contact.model.js"

const contactController=async(req,res,next)=>{
   try {
    const response=req.body
    const contactData= await Contact.create(response)
    return res.status(201).json({message:"Message send successfully",data:contactData})
   } catch (error) {
    next(error)
   } 
}

export default contactController