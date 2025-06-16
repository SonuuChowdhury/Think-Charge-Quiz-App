import mongoose from 'mongoose';
import connectDB from '../../db/ConnectDB.js';

const { loginCredentialsConnection } = await connectDB();

const AttendanceDetailsLayout = new mongoose.Schema({
  teamName: { type: String, required: true }, 
  mobile: { type: Number, required: true },
  isBanned: { type: Boolean, default: false },
  EnteredOn: { type: Date},
  setAssigned:{ type: String},
  isAllPresent:{type:Boolean},
  PresentMembers: [{ 
    name: { type: String},
    role: { type: String }
  }]
});

const AttendanceDetailsSchema = loginCredentialsConnection.model('attendancedetails', AttendanceDetailsLayout);
export default AttendanceDetailsSchema;
