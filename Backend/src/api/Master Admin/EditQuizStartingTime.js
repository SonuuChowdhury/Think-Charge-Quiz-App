import express from 'express';
import QuizManagementDetailsSchema from '../../models/Admins/QuizManageMentDetails.js';
import GetCurrentISTDate from '../../../Demo/GetCurrentISTDate.js';

const EditQuizStartingTime = express.Router();

EditQuizStartingTime.post('/edit-start-time', async (req, res) => {
  try {
    const { setNow, time, shouldDelete } = req.body;

    // Fetch the latest quiz settings
    const quizSettings = await QuizManagementDetailsSchema.findOne();
    
    if (!quizSettings) {
      return res.status(404).json({ msg: "Quiz settings not found" });
    }

    let updatedTime;

    if (shouldDelete) {
      updatedTime = null;
      console.log(`Quiz time deleted - Delete: ${shouldDelete}`);
      return res.status(200).json({ 
        msg: "Quiz start time deleted successfully",
        StartQuizOn: null
      });
    }

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

    console.log(`Quiz time updated - Set Now: ${setNow}, Time: ${updatedTime?.toISOString()}`);

    return res.status(200).json({ 
      msg: setNow ? "Quiz start time set to current time" : "Quiz start time updated successfully", 
      StartQuizOn: updatedTime.toISOString()
    });

  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default EditQuizStartingTime;
