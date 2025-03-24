import express from 'express';
import QuizManagementDetailsSchema from '../../../models/Admins/QuizManageMentDetails.js';

const VerifyLockOpenKey = express.Router();

VerifyLockOpenKey.get('/verify-key/:key', async (req, res) => {
  try {
    const { key } = req.params; // Get the key from URL params

    if (!key) {
      return res.status(400).json({ msg: "Key is required" });
    }

    // Find the document containing the passcode
    const existingEntry = await QuizManagementDetailsSchema.findOne();

    if (!existingEntry || existingEntry.passCode !== key) {
      return res.status(200).json({ verified: false, msg: "Invalid key" });
    }

    // If key matches, remove the existing passcode from the database
    await QuizManagementDetailsSchema.updateOne({}, { $unset: { passCode: "", passCodeGeneratedOn: "" } });

    return res.status(200).json({ verified: true, msg: "Key verified successfully" });

  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default VerifyLockOpenKey;
