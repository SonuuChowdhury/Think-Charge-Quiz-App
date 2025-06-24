import dotenv from 'dotenv'
import jwt, { decode } from 'jsonwebtoken'

dotenv.config()

const ParticipantTokenVerification = async (req,res,next)=>{
    const token = req.headers['participant-token'];
    if (!token) return res.status(403).json({ msg: 'Token Not Found' });

    try{
        const decoded= jwt.verify(token,process.env.JWT_SECRET)
        if(decoded){
            req.user=decoded;
            if(decoded.role=="participant"){
                next()
            }else{
                return res.status(403).json({msg:'Unauthorized: Session Expired'})
            }
        }else{
            return res.status(403).json({msg:'Unauthorized: Session Expired'})
        }
    }catch(error){
        console.log(error);
        return res.status(403).json({msg:'Unauthorized: Error Occured'})
    }
}

export default ParticipantTokenVerification;