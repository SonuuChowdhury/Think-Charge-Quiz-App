import express from 'express';
import QuizManagementDetailsSchema from '../../../models/Admins/QuizManageMentDetails.js';

const GetQuestions = express.Router();

GetQuestions.get('/get-next-question', async (req, res) => {
    const user = req.user;
    

    

  
});

export default GetQuestions;
