import mongoose from 'mongoose';
import connectDB from '../../db/ConnectDB.js';

const { loginCredentialsConnection } = await connectDB();

const ParticipantsDetailsSchema = new mongoose.Schema({
  teamName: { type: String, required: true }, 
  mobile: { type: Number, required: true }, 
  isBanned: { type: Boolean, default: false },
  groupName: { type: String, required: true },
  email:{ type: String, required: true }, 
  password: { type: String, required: true },
  LastLogin: { type: Date, default: null}, 
  joined: { type: Date},
  teamMembers: [
    {
      name: { type: String, required: true },
      department: { type: String, required: true },
      sem: { type: Number, required: true },
      gender: { type: String, enum: ['Male', 'Female'], required: true },
      role: { type: String, required: true }
    }
  ]
});

const ParticipantsDetails = loginCredentialsConnection.model('participantsdetails', ParticipantsDetailsSchema);
export default ParticipantsDetails;
