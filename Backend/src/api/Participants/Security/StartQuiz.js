import ParticipantsDetails from '../../../models/Participants/ParticipantsDetails.js';
import AttendanceDetailsSchema from '../../../models/Participants/AttendanceDetails.js';
import QuizManagementDetailsSchema from '../../../models/Admins/QuizManageMentDetails.js';
import ResultsDetailsSchema from '../../../models/Participants/ResultsDetails.js';
import GetCureentIST from '../../../../Demo/GetCurrentIST.js';
import express from 'express';
import jwt from  'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const StartQuiz = express.Router();
StartQuiz.use(express.json());

StartQuiz.post('/start-quiz', async (req, res) => {
    const user = req.user;

    try {
        // Find participant and get groupName
        const participant = await ParticipantsDetails.findOne({ mobile: user._id });
        const participantAttendance = await AttendanceDetailsSchema.findOne({ mobile: user.mobile });
        if (!participant) {
            return res.status(404).json({ message: 'Participant not found' });  
        }
        if (!participantAttendance) {
                return res.status(404).json({ message: 'Participant attendance not found.' });
            }
        const groupName = participant.groupName;
        if (!groupName) {
            return res.status(400).json({ message: 'Group name not found for participant.' });
        }

        // Find quiz management details
        const quizDetails = await QuizManagementDetailsSchema.findOne({});
        if (!quizDetails) {
            return res.status(404).json({ message: 'Quiz management details not found.' });
        }

        // Find start time for this group in StartQuizOn array
        const groupQuizInfo = quizDetails.StartQuizOn.find(g => g.groupName === groupName);
        if (!groupQuizInfo || !groupQuizInfo.startTime) {
            return res.status(404).json({ message: 'Quiz start time not set for your group.' });
        }

        // Check if current time is within the allowed quiz window (startTime to startTime + 20 min)
        let now = await GetCureentIST();
        // Ensure 'now' is a Date object
        if (typeof now === 'string') {
            now = new Date(now);
        }
        const startTime = new Date(groupQuizInfo.startTime);
        const endTime = new Date(startTime.getTime() + 20 * 60000); // 20 minutes after startTime
        if (now < startTime) {
            return res.status(403).json({ message: 'Quiz has not started yet for your group.' });
        }
        if (now > endTime) {
            return res.status(403).json({ message: 'Quiz window has closed for your group.' });
        }

        let QuizEndTime = new Date(startTime.getTime() + 1 * 60 * 60 * 1000); // 1 hour after startTime

        // Initialize empty result document for participant if not exists
        let resultDoc = await ResultsDetailsSchema.findOne({ mobile: user.mobile });
        if (!resultDoc) {
            resultDoc = new ResultsDetailsSchema({
                mobile: user.mobile,
                setAssigned: participant.setAssigned || '',
                taskHistory: [],
                batteryStatus: 100,
                startedOn: now,
                submitedOn: null,
                frontendSecurityInteruptionCount: 0,
                rank: 0,
                numberOfHintsUsed: 0,
                numberOfWrongAttempts: 0
            });
            await resultDoc.save();
        }
        const token = await jwt.sign({groupName:groupName, startTime:startTime, quizEndTime:QuizEndTime,setAssigned: participant.setAssigned},process.env.JWT_SECRET,{expiresIn:'2h'})

        return res.status(200).json({
            QuizDetailsToken: token,
            message: 'Quiz started successfully.' 
            });
    } catch (error) {
        return res.status(500).json({ message: 'Error starting quiz.', error: error.message });
    }
});

export default StartQuiz;
