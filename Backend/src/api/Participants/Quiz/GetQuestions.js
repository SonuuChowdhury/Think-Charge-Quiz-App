import express from 'express';
import GetCurrentISTDate from '../../../../Demo/GetCurrentISTDate.js';
import GenerateStationaryTaskData from '../../../../Demo/GenerateStationaryTaskData.js';
import GenerateDynamicTaskData from '../../../../Demo/GenerateDynamicTaskData.js';
import QuestionsDetailsSchema from '../../../models/Participants/QuestionsDetailsSchema.js';
import ResultsDetailsSchema from '../../../models/Participants/ResultsDetails.js';

const GetQuestions = express.Router();

GetQuestions.get('/get-next-question', async (req, res) => {
    const user = req.user;
    const userinfo = req.userinfo;

    const resultData =  await ResultsDetailsSchema.findOne({ mobile: user.mobile });
    if (!resultData) {
        return res.status(404).json({ message: 'Result data not found for the participant.' });
    }

    let nextRoundNumber = resultData.roundInfo.length + 1;
    if (nextRoundNumber==2) {
        const PrevRoundCompleted = resultData.roundInfo.some(info => info.roundNumber === 'R1' && info.endTime !== null);
        if (!PrevRoundCompleted) {
            nextRoundNumber = 1;
        }
    }
    if (nextRoundNumber==3) {
        const PrevRoundCompleted = resultData.roundInfo.some(info => info.roundNumber === 'R2' && info.endTime !== null);
        if (!PrevRoundCompleted) {
            nextRoundNumber = 2;
        }
    }

    if (nextRoundNumber==4) {
        const PrevRoundCompleted = resultData.roundInfo.some(info => info.roundNumber === 'R3' && info.endTime !== null);
        if (!PrevRoundCompleted) {
            nextRoundNumber = 3;
        }else{
            return res.status(200).json({
            message: 'All Rounds Completed successfully.'
            }); 
        }
    }

    if(nextRoundNumber==1) {
        const StationaryData = await GenerateStationaryTaskData(userinfo.setAssigned, 'R1');
        const dynamicTaskData = await GenerateDynamicTaskData('start');
        const taskString = `${StationaryData}${dynamicTaskData}`;
        if (!resultData.taskHistory.includes(taskString)) {
            resultData.taskHistory.push(taskString);
        }
        // Check if roundInfo already contains 'R1'
        const alreadyStarted = resultData.roundInfo.some(info => info.roundNumber === 'R1');
        if (!alreadyStarted) {
            resultData.roundInfo.push({
            roundNumber: 'R1',
            startTime: new Date(GetCurrentISTDate()),
            endTime: null
            });
        }
        await resultData.save();

        const questionData = await QuestionsDetailsSchema.findOne({ setName: userinfo.setAssigned, 'rounds.roundNumber': 1 });
        if (!questionData || !questionData.rounds || questionData.rounds.length === 0) {
            return res.status(404).json({ message: 'No questions found for Round 1.' });
        }
        let data = questionData.rounds.filter(round => round.roundNumber === 1);
        data[0].correctOptions=[]
        data[0].numericAnswer=null;
        data[0].hint=[];

        return res.status(200).json({
            message: 'Round 1 Started successfully.',
            question: data
        });        
    }

    if(nextRoundNumber==2){
        const StationaryData = await GenerateStationaryTaskData(userinfo.setAssigned, 'R2');
        const dynamicTaskData = await GenerateDynamicTaskData('start');
        const taskString = `${StationaryData}${dynamicTaskData}`;
        if (!resultData.taskHistory.includes(taskString)) {
            resultData.taskHistory.push(taskString);
        }
        // Check if roundInfo already contains 'R1'
        const alreadyStarted = resultData.roundInfo.some(info => info.roundNumber === 'R2');
        if (!alreadyStarted) {
            resultData.roundInfo.push({
            roundNumber: 'R2',
            startTime: new Date(GetCurrentISTDate()),
            endTime: null
            });
        }
        await resultData.save();

        const questionData = await QuestionsDetailsSchema.findOne({ setName: userinfo.setAssigned, 'rounds.roundNumber': 2 });
        if (!questionData || !questionData.rounds || questionData.rounds.length === 0) {
            return res.status(404).json({ message: 'No questions found for Round 2.' });
        }
        let data = questionData.rounds.filter(round => round.roundNumber === 2);
        data[0].correctOptions=[]
        data[0].numericAnswer=null;
        data[0].hint=[];
        
        return res.status(200).json({
            message: 'Round 2 Started successfully.',
            question: data
        })
    }

    if(nextRoundNumber==3){
        const StationaryData = await GenerateStationaryTaskData(userinfo.setAssigned, 'R3');
        const dynamicTaskData = await GenerateDynamicTaskData('start');
        const taskString = `${StationaryData}${dynamicTaskData}`;
        if (!resultData.taskHistory.includes(taskString)) {
            resultData.taskHistory.push(taskString);
        }
        // Check if roundInfo already contains 'R1'
        const alreadyStarted = resultData.roundInfo.some(info => info.roundNumber === 'R3');
        if (!alreadyStarted) {
            resultData.roundInfo.push({
            roundNumber: 'R3',
            startTime: new Date(GetCurrentISTDate()),
            endTime: null
            });
        }
        await resultData.save();

        const questionData = await QuestionsDetailsSchema.findOne({ setName: userinfo.setAssigned, 'rounds.roundNumber': 3});
        if (!questionData || !questionData.rounds || questionData.rounds.length === 0) {
            return res.status(404).json({ message: 'No questions found for Round 3.' });
        }
        let data = questionData.rounds.filter(round => round.roundNumber === 3);
        data[0].correctOptions=[]
        data[0].numericAnswer=null;
        data[0].hint=[];
        
        return res.status(200).json({
            message: 'Round 3 Started successfully.',
            question: data
        })
    } 

});

export default GetQuestions;
