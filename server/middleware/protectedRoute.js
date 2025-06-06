import jwt from 'jsonwebtoken'

export const protectedRoute=(req,res,next)=>{ 
    const token = req.cookies.token;

    if(!token) return res.status(401).json({success:false,message:"unauthorized"}) 
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded) return res.status(401).json({success:false,message:"invalid token"})
        req.userId=decoded.userId;

        next();    
    } catch (error) {
        console.log("error in verifying token",error)
        return res.status(500).json({success:false,message:"server error"})
    }
}