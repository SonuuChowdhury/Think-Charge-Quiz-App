import mongoose from 'mongoose';
import connectDB from '../../db/ConnectDB.js';

const { loginCredentialsConnection } = await connectDB();

const CredialsSchemaLayout = new mongoose.Schema({
  uid: { type: String, required: true }, 
  password: { type: String, required: true},
  role: {type: String},
  LastSetAssigned: {type: Number},
  LastLogin: { type: Date}, 
  StartQuizOn: { type: Date}, 
  MasterKey: {type: String},
});

const CredialsSchemaDetails = loginCredentialsConnection.model('admincredentials', CredialsSchemaLayout);
export default CredialsSchemaDetails;
