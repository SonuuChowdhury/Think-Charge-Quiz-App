import ParticipantsDetails from '../../../models/Participants/ParticipantsDetails.js';
import AttendanceDetailsSchema from '../../../models/Participants/AttendanceDetails.js';
import QuizManagementDetailsSchema from '../../../models/Admins/QuizManageMentDetails.js';
import express from 'express';

const GetAttendanceStatus = express.Router();
GetAttendanceStatus.use(express.json());

GetAttendanceStatus.post('/get-attendance-status', async (req, res) => {
    const user = req.user

    try {
        const participant = await ParticipantsDetails.findById(user._id);
        if (!participant) {
            return res.status(404).json({ msg: "Participant not found", groupStartTime: null });
        }

        // Fetch group start time
        let groupStartTime = null;
        if (participant.groupName) {
            const quizDetails = await QuizManagementDetailsSchema.findOne({});
            if (quizDetails && Array.isArray(quizDetails.StartQuizOn)) {
                const groupInfo = quizDetails.StartQuizOn.find(item => item.groupName === participant.groupName);
                if (groupInfo) {
                    groupStartTime = groupInfo.startTime;
                }
            }
        }

        const attendance = await AttendanceDetailsSchema.findOne({ mobile: Number(user.mobile) });

        if (!attendance) {
            return res.status(200).json({ 
                isAttendanceMarked: false,
                attendanceDetails: null,
                groupStartTime
            });
        }

        return res.status(200).json({
            isAttendanceMarked: true,
            attendanceDetails: attendance,
            groupStartTime
        });
    } catch (error) {
        return res.status(500).json({ msg: `Error fetching attendance status: ${error}` });
    }
   
});

export default GetAttendanceStatus;
