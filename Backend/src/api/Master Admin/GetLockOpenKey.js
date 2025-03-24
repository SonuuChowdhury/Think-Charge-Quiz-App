import express from 'express';
import QuizManagementDetailsSchema from '../../models/Admins/QuizManageMentDetails.js';
import generateRandomCode from '../../../Demo/GenerateRandomCode.js';
import GetCurrentIST from '../../../Demo/GetCurrentIST.js';

const GetLockOpenKey = express.Router();

GetLockOpenKey.get('/get-key', async (req, res) => {
  try {
    const code =await generateRandomCode(); // Generate a 5-character random code
    const currentIST = await GetCurrentIST(); // Get the current IST timestamp

    // Create a new entry or update an existing one
    const updatedEntry = await QuizManagementDetailsSchema.findOneAndUpdate(
      {}, // No filter to ensure only one document exists
      { passCode: code, passCodeGeneratedOn: currentIST },
      { upsert: true, new: true } // Create if not exists, return updated document
    );

    return res.status(200).json({
      msg: "Passcode generated successfully",
      passCode: updatedEntry.passCode,
      generatedOn: updatedEntry.passCodeGeneratedOn,
    });

  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default GetLockOpenKey;
