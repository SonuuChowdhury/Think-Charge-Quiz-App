import express from 'express';
import AttendanceDetailsSchema from '../../models/Participants/AttendanceDetails.js';

const DeleteOneAttendance = express.Router();
DeleteOneAttendance.use(express.json());

DeleteOneAttendance.delete('/delete-one-attendance/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Attendance ID is required" });
    }

    // Find and delete the attendance record
    const deletedAttendance = await AttendanceDetailsSchema.findByIdAndDelete(id);

    if (!deletedAttendance) {
      return res.status(404).json({ msg: "Attendance record not found" });
    }

    return res.status(200).json({ 
      msg: "Attendance deleted successfully",
      deletedEntry: deletedAttendance
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ msg: "Invalid ID format" });
    }
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default DeleteOneAttendance;
