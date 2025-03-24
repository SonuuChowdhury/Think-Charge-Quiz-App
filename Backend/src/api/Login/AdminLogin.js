import CredialsSchemaDetails from '../../models/Admins/CredentialsSchema.js';
import express from 'express';
import jwt from  'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const getAdminCredentials = express.Router();
getAdminCredentials.use(express.json());

getAdminCredentials.post('/login/admin', async (req, res) => {
    const { uid, password} = req.body;
    // reqType=0 for otp generation and reqType=1 for otp verification 
    // uid Number Validation
    if (!uid) {
        return res.status(400).json({msg:"uid is required"});
    }
    if (!password) {
        return res.status(400).json({msg:"Password is required"});
    }
    const AdminUIDString=String(uid)
        try {
            // Find admin with matching uid
            const admin = await CredialsSchemaDetails.findOne({ uid: AdminUIDString });
            if (!admin) {
                return res.status(404).json({msg:'admin not found'});
            }
            const isMatched = await bcrypt.compare(password,admin.password)
    
            if(!isMatched){
                return res.status(400).json({msg:'Invalid Password'})
            } 
            const token = await jwt.sign({_id:admin._id, role:admin.role},process.env.JWT_SECRET,{expiresIn:'2h'})
            return res.status(200).json({ token, role: admin.role });
        } catch (error) {
            return res.status(500).json({msg:`error while login: ${error}`})
        }
});

export default getAdminCredentials;
