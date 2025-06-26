import mongoose from 'mongoose';
import connectDB from '../../db/ConnectDB.js';

const { loginCredentialsConnection } = await connectDB();

const QuizManagementLayout = new mongoose.Schema({
  passCode: { type: String },
  passCodeGeneratedOn: { type: Date },
  LastSetAssigned: [{
    groupName: { type: String },
    lastSetAssigned: { type: String }
  }],
  StartQuizOn: [{
    groupName: { type: String },
    startTime: { type: Date }
  }]
});

const QuizManagementDetailsSchema = loginCredentialsConnection.model('quizmanagementdetails', QuizManagementLayout);
export default QuizManagementDetailsSchema;
