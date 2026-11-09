const adminMiddelware=async(req,res,next)=>{
    try {
        const role=req.user.role

        if(role !== "admin"){
            return res.status(403).json({message:"Access Denied. Admin Only."})
        }
       next()
    } catch (error) {
        next(error)
    }
}

export default adminMiddelware