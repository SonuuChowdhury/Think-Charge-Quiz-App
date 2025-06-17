import express from 'express';
import QuizManagementDetailsSchema from '../../models/Admins/QuizManageMentDetails.js';
import GetCurrentISTDate from '../../../Demo/GetCurrentISTDate.js';

const EditQuizStartingTime = express.Router();

EditQuizStartingTime.post('/edit-start-time', async (req, res) => {
  try {
    const { setNow, time } = req.body;

    // Fetch the latest quiz settings
    const quizSettings = await QuizManagementDetailsSchema.findOne();
    
    if (!quizSettings) {
      return res.status(404).json({ msg: "Quiz settings not found" });
    }

    let updatedTime;

    if (setNow) {
      // Set the current IST time
      updatedTime = await GetCurrentISTDate();
    } else {
      // Validate and set provided time
      if (!time || isNaN(Date.parse(time))) {
        return res.status(400).json({ msg: "Invalid time format" });
      }
      updatedTime = new Date(time);
    }

    // Update StartQuizOn field
    quizSettings.StartQuizOn = updatedTime;
    await quizSettings.save();

    return res.status(200).json({ 
      msg: "Quiz start time updated successfully", 
      StartQuizOn: updatedTime.toISOString() // Convert to ISO string for JSON response
    });

  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default EditQuizStartingTime;
