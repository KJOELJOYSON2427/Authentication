const isAdminUser=(req,res,next)=>{
    if(req.userInfo.role!=="Admin"){
        return res.status(403).json({
            success:false,
            message:"Access denied! Admin Rights required."
        })
    }
    next();
}
module.exports=isAdminUser