import express from 'express';
import AttendanceDetailsSchema from '../../models/Participants/AttendanceDetails.js';

const ResetAttendance = express.Router();
ResetAttendance.use(express.json());

ResetAttendance.delete('/delete-all-attendance', async (req, res) => {
  try {
    // Delete all attendance records
    const deleteResult = await AttendanceDetailsSchema.deleteMany({});

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ msg: "No attendance records found to delete" });
    }

    return res.status(200).json({
      msg: "All attendance records deleted successfully",
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
