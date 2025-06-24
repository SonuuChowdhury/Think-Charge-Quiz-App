import express from 'express';
import AttendanceDetailsSchema from '../../models/Participants/AttendanceDetails.js';
import ParticipantsDetails from '../../models/Participants/ParticipantsDetails.js';
import QuizManagementDetailsSchema from '../../models/Admins/QuizManageMentDetails.js';
import GetCurrentIST from '../../../Demo/GetCurrentIST.js';

const DeleteOneAttendance = express.Router();
DeleteOneAttendance.use(express.json());

DeleteOneAttendance.delete('/delete-one-attendance/:mobile', async (req, res) => {
  try {
    const mobile = Number(req.params.mobile);

    if (!mobile) {
      return res.status(400).json({ msg: "Valid mobile number is required" });
    }
    const participant = await ParticipantsDetails.findOne({ mobile: mobile });

    if (!participant) {
      return res.status(404).json({ msg: "Participant not found" });
    }

    // Fetch quiz settings and group start time
    const QuizSettingsDetails = await QuizManagementDetailsSchema.findOne();
    if (!QuizSettingsDetails || !Array.isArray(QuizSettingsDetails.StartQuizOn)) {
      return res.status(404).json({ msg: 'Quiz settings or group start times not found.' });
    }
    // Find the start time for the participant's group
    const groupInfo = QuizSettingsDetails.StartQuizOn.find(g => g.groupName === participant.groupName);
    if (!groupInfo || !groupInfo.startTime) {
      return res.status(404).json({ msg: `Start time for group '${participant.groupName}' not found.` });
    }
    // Get current IST time
    const nowIST = new Date(await GetCurrentIST());
    const startTime = new Date(groupInfo.startTime);
    const windowStart = new Date(startTime.getTime() - 30 * 60 * 1000); // 30 min before
    const windowEnd = new Date(startTime.getTime() + 15 * 60 * 1000); // 15 min after
    if (nowIST < windowStart || nowIST > windowEnd) {
      return res.status(403).json({
        msg: `Attendance for group '${participant.groupName}' can only be marked between ${windowStart.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} and ${windowEnd.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}. Current time: ${nowIST.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
      });
    }

    // Find and delete the attendance record by mobile number
    const deletedAttendance = await AttendanceDetailsSchema.findOneAndDelete({ mobile });

    if (!deletedAttendance) {
      return res.status(404).json({ msg: "Attendance record not found" });
    }

    return res.status(200).json({ 
      msg: "Attendance deleted successfully",
      deletedEntry: deletedAttendance
    });

  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default DeleteOneAttendance;
