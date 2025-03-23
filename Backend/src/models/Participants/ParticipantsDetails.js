import mongoose from 'mongoose';
import connectDB from '../../db/ConnectDB.js';

const { loginCredentialsConnection } = await connectDB();

const ParticipantsDetailsSchema = new mongoose.Schema({
  teamName: { type: String, required: true }, 
  mobile: { type: Number, required: true }, 
  password: { type: String, required: true },
  LastLogin: { type: Date, default: Date.now()}, 
  teamMembers: [
    {
      name: { type: String, required: true },
      department: { type: String, required: true },
      sem: { type: Number, required: true },
      gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
      role: { type: String, required: true }
    }
  ]
});

const ParticipantsDetails = loginCredentialsConnection.model('participantsdetails', ParticipantsDetailsSchema);
export default ParticipantsDetails;
