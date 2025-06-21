import express from 'express';
import QuizManagementDetailsSchema from '../../models/Admins/QuizManageMentDetails.js';

const EditQuizStartingTime = express.Router();

EditQuizStartingTime.post('/edit-start-time', async (req, res) => {
  const { groupName, startTime } = req.body;

  try {
    // Validate required fields
    if (!groupName || !startTime) {
      return res.status(400).json({
        success: false,
        message: 'Group name and start time are required'
      });
    }

    // Validate startTime format
    const parsedStartTime = new Date(startTime);
    if (isNaN(parsedStartTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start time format. Please provide a valid date/time'
      });
    }

    // First, check if there's a document with StartQuizOn as a date and fix it
    const quizManagement = await QuizManagementDetailsSchema.findOne();
    
    if (!quizManagement) {
      return res.status(404).json({
        success: false,
        message: 'Quiz management details not found'
      });
    }

    // If StartQuizOn is not an array, we need to fix it using a direct update
    if (!Array.isArray(quizManagement.StartQuizOn)) {
      // Use direct MongoDB update to change the field type
      await QuizManagementDetailsSchema.updateOne(
        { _id: quizManagement._id },
        { $set: { StartQuizOn: [] } }
      );
      
      // Reload the document after the fix
      const updatedQuizManagement = await QuizManagementDetailsSchema.findOne();
      
      // Find the group in the StartQuizOn array
      const groupIndex = updatedQuizManagement.StartQuizOn.findIndex(
        group => group.groupName === groupName
      );

      if (groupIndex === -1) {
        // Group not found, create a new one
        updatedQuizManagement.StartQuizOn.push({
          groupName: groupName,
          startTime: parsedStartTime
        });
        
        await updatedQuizManagement.save();

        return res.status(201).json({
          success: true,
          message: `New group '${groupName}' created with start time`,
          data: {
            groupName,
            startTime: parsedStartTime
          }
        });
      }

      // Update the start time for the existing group
      updatedQuizManagement.StartQuizOn[groupIndex].startTime = parsedStartTime;
      
      // Save the updated document
      await updatedQuizManagement.save();

      return res.status(200).json({
        success: true,
        message: `Start time updated successfully for group '${groupName}'`,
        data: {
          groupName,
          startTime: parsedStartTime
        }
      });
    }

    // If StartQuizOn is already an array, proceed normally
    const groupIndex = quizManagement.StartQuizOn.findIndex(
      group => group.groupName === groupName
    );

    if (groupIndex === -1) {
      // Group not found, create a new one
      quizManagement.StartQuizOn.push({
        groupName: groupName,
        startTime: parsedStartTime
      });
      
      await quizManagement.save();

      return res.status(201).json({
        success: true,
        message: `New group '${groupName}' created with start time`,
        data: {
          groupName,
          startTime: parsedStartTime
        }
      });
    }

    // Update the start time for the existing group
    quizManagement.StartQuizOn[groupIndex].startTime = parsedStartTime;
    
    // Save the updated document
    await quizManagement.save();

    return res.status(200).json({
      success: true,
      message: `Start time updated successfully for group '${groupName}'`,
      data: {
        groupName,
        startTime: parsedStartTime
      }
    });

  } catch (error) {
    console.error('Error updating quiz start time:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating quiz start time'
    });
  }
});

export default EditQuizStartingTime;
