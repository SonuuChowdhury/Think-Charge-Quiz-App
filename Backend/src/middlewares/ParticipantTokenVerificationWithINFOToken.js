import dotenv from 'dotenv'
import jwt, { decode } from 'jsonwebtoken'

dotenv.config()

const ParticipantTokenVerificationWithINFOToken = async (req,res,next)=>{
    const token = req.headers['participant-token'];
    const QuizDetailsToken = req.headers['participant-details-token']
    if (!token) return res.status(403).json({ msg: 'Token Not Found' });

    try{
        const decoded= jwt.verify(token,process.env.JWT_SECRET)
        const DetailsDecoded= jwt.verify(QuizDetailsToken,process.env.JWT_SECRET)
        if(decoded){
            req.user=decoded;
            req.userinfo=DetailsDecoded;
            if(decoded.role=="participant"){
                // Check if the DetailsDecoded contains the required information
                if(!DetailsDecoded || !DetailsDecoded.startTime|| !DetailsDecoded.setAssigned || !DetailsDecoded.quizEndTime || !DetailsDecoded.groupName){
                    return res.status(403).json({msg:'Unauthorized: Invalid Details Token'})
                }
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

export default ParticipantTokenVerificationWithINFOToken;