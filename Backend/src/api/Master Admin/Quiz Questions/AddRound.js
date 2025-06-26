import express from 'express';
import QuestionsDetailsSchema from '../../../models/Participants/QuestionsDetailsSchema.js';

const AddRound = express.Router();

AddRound.post('/add-round', async (req, res) => {
    try {
        const { setName, roundNumber, questionType, questionTitle, questionDescription, assets, codeAssets, numericAnswer, options, correctOptions, hint } = req.body;

        // Validate required fields
        if (!setName || !roundNumber || !questionType || !questionTitle || !questionDescription) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Validate setName format: S01, S02, S03, etc.
        const setNamePattern = /^S\d{2}$/;
        if (!setNamePattern.test(setName)) {
            return res.status(400).json({ message: 'setName must be in the format S01, S02, S03, etc.' });
        }

        // Find the quiz set by setName
        const quizSet = await QuestionsDetailsSchema.findOne({ setName });
        if (!quizSet) {
            return res.status(404).json({ message: 'Quiz set not found.' });
        }

        // Create the new round object
        const newRound = {
            roundNumber,
            questionType,
            questionTitle,
            questionDescription,
            assets: assets || [],
            codeAssets: codeAssets || '',
            numericAnswer: numericAnswer || null,
            options: options || [],
            correctOptions: correctOptions || [],
            hint: hint || []
        };

        // Add the new round to the quiz set
        quizSet.rounds.push(newRound);
        quizSet.totalRounds = (quizSet.totalRounds || 0) + 1;
        await quizSet.save();

        res.status(201).json({ message: 'Round added successfully.', round: newRound });
    } catch (error) {
        res.status(500).json({ message: 'Error adding round.', error: error.message });
    }
    
});

export default AddRound ;
