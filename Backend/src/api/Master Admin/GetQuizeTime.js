import express from 'express';
import QuizManagementDetailsSchema from '../../models/Admins/QuizManageMentDetails.js';

const GetQuizStartingTime = express.Router();

GetQuizStartingTime.get('/get-start-time', async (req, res) => {
  try {
    // Fetch the latest quiz settings
    const quizSettings = await QuizManagementDetailsSchema.findOne();
    
    if (!quizSettings) {
      return res.status(404).json({ msg: "Quiz settings not found" });
    }

    // Return the StartQuizOn time
    return res.status(200).json({ 
      msg: "Quiz start time retrieved successfully", 
      StartQuizOn: quizSettings.StartQuizOn 
    });

  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default GetQuizStartingTime;
