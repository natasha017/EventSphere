const validate=(schema)=>async(req,res,next)=>{
    try {
        const parseBody=await schema.parseAsync(req.body)
        req.body=parseBody
        next()
    } catch (err) {
        const msg=err.issues[0].message
        return res.status(400).json({message:msg}) 
    }
}

export default validate