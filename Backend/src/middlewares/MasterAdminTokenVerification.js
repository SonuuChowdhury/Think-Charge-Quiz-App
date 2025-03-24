import dotenv from 'dotenv'
import jwt, { decode } from 'jsonwebtoken'

dotenv.config()

const MasterAdminTokenVerification=async (req,res,next)=>{
    const token = req.headers['scee-event-admin-token'];
    if (!token) return res.status(403).json({ msg: 'Token Not Found' });

    try{
        const decoded= jwt.verify(token,process.env.JWT_SECRET)
        if(decoded){
            req.user=decoded;
            if(decoded.role=="masterAdmin"){
                next()
            }else{
                return res.status(403).json({msg:'Unauthorized: Session Expired'})
            }
        }else{
            return res.status(403).json({msg:'Unauthorized: Session Expired'})
        }
    }catch(error){
        return res.status(403).json({msg:'Unauthorized: Error Occured'})
    }
}

export default MasterAdminTokenVerification;