import ParticipantsDetails from '../../models/Participants/ParticipantsDetails.js';
import AttendanceDetailsSchema from '../../models/Participants/AttendanceDetails.js';
import express from 'express';

dotenv.config()

const GetAttendanceStatus = express.Router();
GetAttendanceStatus.use(express.json());

GetAttendanceStatus.post('/get-attendance-status', async (req, res) => {
    const {mobile} = req.body;
    if (!mobile) {
        return res.status(400).json({msg:"mobile is required"});
    }
    try {
        const participant = await ParticipantsDetails.findOne({ mobile: Number(mobile) });
        if (!participant) {
            return res.status(404).json({ msg: "Participant not found" });
        }

        const attendance = await AttendanceDetailsSchema.findOne({ mobile: Number(mobile) });

        if (!attendance) {
            return res.status(200).json({ 
                isAttendanceMarked: false,
                attendanceDetails: null
            });
        }

        return res.status(200).json({
            isAttendanceMarked: true,
            attendanceDetails: attendance
        });
    } catch (error) {
        return res.status(500).json({ msg: `Error fetching attendance status: ${error}` });
    }
   
});

export default GetAttendanceStatus;
