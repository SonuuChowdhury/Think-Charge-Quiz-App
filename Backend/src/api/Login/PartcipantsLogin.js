import ParticipantsDetails from '../../models/Participants/ParticipantsDetails.js';
import express from 'express';
import jwt from  'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const GetPartcipantsCredentials = express.Router();
GetPartcipantsCredentials.use(express.json());

GetPartcipantsCredentials.post('/login/participant', async (req, res) => {
    const { mobile, password} = req.body;
    // reqType=0 for otp generation and reqType=1 for otp verification 
    // uid Number Validation
    if (!mobile) {
        return res.status(400).json({msg:"mobile is required"});
    }
    if (!password) {
        return res.status(400).json({msg:"Password is required"});
    }
    const ParticipantsMobile=Number(mobile)
    const ParticipantsPassword = String(password)
        try {
            // Find admin with matching uid
            const participant = await ParticipantsDetails.findOne({ mobile: ParticipantsMobile });
            if (!participant) {
                return res.status(404).json({msg:'team not found'});
            }
            const isMatched = await bcrypt.compare(ParticipantsPassword,participant.password)
    
            if(!isMatched){
                return res.status(400).json({msg:'Invalid Password'})
            } 
            const token = await jwt.sign({_id:participant._id},process.env.JWT_SECRET,{expiresIn:'2h'})
            // Exclude password and LastLogin from response
            const { password: _, LastLogin: __, ...participantData } = participant.toObject();

            return res.status(200).json({ token, participant: participantData });
        } catch (error) {
            return res.status(500).json({msg:`error while login: ${error}`})
        }
});

export default GetPartcipantsCredentials;
