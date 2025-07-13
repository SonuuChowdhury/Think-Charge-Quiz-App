import express from 'express';
import GenerateStationaryTaskData from '../../../../Demo/GenerateStationaryTaskData.js';
import GenerateDynamicTaskData from '../../../../Demo/GenerateDynamicTaskData.js';
import QuestionsDetailsSchema from '../../../models/Participants/QuestionsDetailsSchema.js';
import ResultsDetailsSchema from '../../../models/Participants/ResultsDetails.js';

const GetHint = express.Router();

GetHint.get('/get-hint', async (req, res) => {
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
        const dynamicTaskData = await GenerateDynamicTaskData('hint');
        const taskString = `${StationaryData}${dynamicTaskData}`;
        // Extract the last 11 characters (S02R303UHXX) from taskString
        const taskCode = taskString.slice(-11);
        // Check if any entry in taskHistory ends with the same code
        const exists = resultData.taskHistory.some(item => item.slice(-11) === taskCode);
        if (!exists) {
            resultData.taskHistory.push(taskString);
        }

        const questionData = await QuestionsDetailsSchema.findOne({ setName: userinfo.setAssigned, 'rounds.roundNumber': 1 });
        if (!questionData || !questionData.rounds || questionData.rounds.length === 0) {
            return res.status(404).json({ message: 'No questions found for Round 1.' });
        }
        let data = questionData.rounds.filter(round => round.roundNumber === 1);
        
        const hint = data[0].hint;
        let battery = resultData.batteryStatus;
        if(!exists){
            battery = battery-4;
            resultData.batteryStatus = battery;
            await resultData.save();
        }

        return res.status(200).json({
            message: 'Round 1 Hint Fetched.',
            hint: hint,
            battery: battery
        });        
    }

    if(nextRoundNumber==2){
        const StationaryData = await GenerateStationaryTaskData(userinfo.setAssigned, 'R2');
        const dynamicTaskData = await GenerateDynamicTaskData('hint');
        const taskString = `${StationaryData}${dynamicTaskData}`;
        // Extract the last 11 characters (S02R303UHXX) from taskString
        const taskCode = taskString.slice(-11);
        // Check if any entry in taskHistory ends with the same code
        const exists = resultData.taskHistory.some(item => item.slice(-11) === taskCode);
        if (!exists) {
            resultData.taskHistory.push(taskString);
        }

        const questionData = await QuestionsDetailsSchema.findOne({ setName: userinfo.setAssigned, 'rounds.roundNumber': 2 });
        if (!questionData || !questionData.rounds || questionData.rounds.length === 0) {
            return res.status(404).json({ message: 'No questions found for Round 2.' });
        }
        let data = questionData.rounds.filter(round => round.roundNumber === 2);
        
        const hint = data[0].hint;
        let battery = resultData.batteryStatus;
        if(!exists){
            battery = battery-4;
            resultData.batteryStatus = battery;
            await resultData.save();
        }

        return res.status(200).json({
            message: 'Round 2 Hint Fetched.',
            hint: hint,
            battery: battery
        });  
    }

    if(nextRoundNumber==3){
        const StationaryData = await GenerateStationaryTaskData(userinfo.setAssigned, 'R3');
        const dynamicTaskData = await GenerateDynamicTaskData('hint');
        const taskString = `${StationaryData}${dynamicTaskData}`;
        // Extract the last 11 characters (S02R303UHXX) from taskString
        const taskCode = taskString.slice(-11);
        // Check if any entry in taskHistory ends with the same code
        const exists = resultData.taskHistory.some(item => item.slice(-11) === taskCode);
        if (!exists) {
            resultData.taskHistory.push(taskString);
        }

        const questionData = await QuestionsDetailsSchema.findOne({ setName: userinfo.setAssigned, 'rounds.roundNumber': 3 });
        if (!questionData || !questionData.rounds || questionData.rounds.length === 0) {
            return res.status(404).json({ message: 'No questions found for Round 3.' });
        }
        let data = questionData.rounds.filter(round => round.roundNumber === 3);
        
        const hint = data[0].hint;
        let battery = resultData.batteryStatus;
        if(!exists){
            battery = battery-4;
            resultData.batteryStatus = battery;
            await resultData.save();
        }

        return res.status(200).json({
            message: 'Round 3 Hint Fetched.',
            hint: hint,
            battery: battery
        });  
    } 

});

export default GetHint;
