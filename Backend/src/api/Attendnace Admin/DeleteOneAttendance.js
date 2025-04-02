import express from 'express';
import AttendanceDetailsSchema from '../../models/Participants/AttendanceDetails.js';

const DeleteOneAttendance = express.Router();
DeleteOneAttendance.use(express.json());

DeleteOneAttendance.delete('/delete-one-attendance/:mobile', async (req, res) => {
  try {
    const mobile = Number(req.params.mobile);

    if (!mobile) {
      return res.status(400).json({ msg: "Valid mobile number is required" });
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
