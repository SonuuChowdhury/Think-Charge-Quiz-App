import express from 'express';
import AttendanceDetailsSchema from '../../models/Participants/AttendanceDetails.js';
import ParticipantsDetails from '../../models/Participants/ParticipantsDetails.js';

const ResetAttendance = express.Router();
ResetAttendance.use(express.json());

ResetAttendance.delete('/delete-all-attendance', async (req, res) => {
  try {
    const { groupName } = req.body;

    let deleteResult;
    let successMsg;
    let notFoundMsg;

    if (groupName) {
      // Find all teams in the group
      const teamsInGroup = await ParticipantsDetails.find({ groupName }, 'mobile').lean();
      if (!teamsInGroup.length) {
        return res.status(404).json({ msg: `No teams found for group '${groupName}'.` });
      }
      const mobiles = teamsInGroup.map(team => team.mobile);

      // Delete attendance records for these mobiles
      deleteResult = await AttendanceDetailsSchema.deleteMany({ mobile: { $in: mobiles } });
      successMsg = `Attendance records for group '${groupName}' deleted successfully`;
      notFoundMsg = `No attendance records found to delete for group '${groupName}'.`;

    } else {
      // Delete all attendance records
      deleteResult = await AttendanceDetailsSchema.deleteMany({});
      successMsg = "All attendance records deleted successfully";
      notFoundMsg = "No attendance records found to delete";
    }

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ msg: notFoundMsg });
    }

    return res.status(200).json({
      msg: successMsg,
      deletedCount: deleteResult.deletedCount
    });

  } catch (error) {
    return res.status(500).json({ 
      msg: "Server Error",
      error: error.message,
      suggestion: "Check database connection or collection permissions"
    });
  }
});

export default ResetAttendance;
