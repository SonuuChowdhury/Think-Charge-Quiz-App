import express from 'express';
import GenerateStationaryTaskData from '../../../../Demo/GenerateStationaryTaskData.js';
import QuestionsDetailsSchema from '../../../models/Participants/QuestionsDetailsSchema.js';
import QuizManagementDetailsSchema from '../../../models/Admins/QuizManageMentDetails.js';
import ResultsDetailsSchema from '../../../models/Participants/ResultsDetails.js';

const GetQuestions = express.Router();

GetQuestions.get('/get-next-question', async (req, res) => {
    const user = req.user;
    const userinfo = req.userinfo;

    const resultData =  await ResultsDetailsSchema.findOne({ mobile: user.mobile });
    if (!resultData) {
        return res.status(404).json({ message: 'Result data not found for the participant.' });
    }
    if(resultData.taskHistory.length === 0) {
        const StationaryData = await GenerateStationaryTaskData(userinfo.setAssigned, 'R1');
        resultData.taskHistory.push(StationaryData); 
        await resultData.save();

        const questionData = await QuestionsDetailsSchema.findOne({ setName: userinfo.setAssigned, 'rounds.roundNumber': 'R1' }, { 'rounds.$': 1 });
        if (!questionData || !questionData.rounds || questionData.rounds.length === 0) {
            return res.status(404).json({ message: 'No questions found for Round 1.' });
        }
        const data = questionData.rounds.filter(round => round.roundNumber === 'R1');
        
        return res.status(200).json({
            message: 'Round 1 Started successfully.',
            question: data
        });        
    }

    

  
});

export default GetQuestions;
