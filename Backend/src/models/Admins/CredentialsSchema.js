import mongoose from 'mongoose';
import connectDB from '../../db/ConnectDB.js';

const { loginCredentialsConnection } = await connectDB();

const CredialsSchemaLayout = new mongoose.Schema({
  uid: { type: String, required: true }, 
  password: { type: String, required: true},
  role: {type: String},
  LastLogin: { type: Date}, 
});

const CredialsSchemaDetails = loginCredentialsConnection.model('admincredentials', CredialsSchemaLayout);
export default CredialsSchemaDetails;
