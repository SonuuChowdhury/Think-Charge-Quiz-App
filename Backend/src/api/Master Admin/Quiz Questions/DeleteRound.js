import express from 'express';
import QuestionsDetailsSchema from '../../../models/Participants/QuestionsDetailsSchema.js';

const DeleteRound = express.Router();

DeleteRound.delete('/delete-round/:setName/:roundName', async (req, res) => {
    try {
        const { setName, roundName } = req.params;
        if (!setName || !roundName) {
            return res.status(400).json({ message: 'Set name and round name are required.' });
        }

        // Validate roundNumber: must be 1, 2, or 3
        const roundNumToDelete = parseInt(roundName, 10);
        if (isNaN(roundNumToDelete) || roundNumToDelete < 1 || roundNumToDelete > 3) {
            return res.status(400).json({ message: 'Round number must be between 1 and 3.' });
        }
        // Validate setName: must be S01, S02, S03, or S04
        const setNamePattern = /^S0[1-4]$/;
        if (!setNamePattern.test(setName)) {
            return res.status(400).json({ message: 'Set name must be S01, S02, S03, or S04.' });
        }

        // Find the quiz set by setName
        const quizSet = await QuestionsDetailsSchema.findOne({ setName });
        if (!quizSet) {
            return res.status(404).json({ message: 'Quiz set not found.' });
        }

        // Remove the round from the quiz set
        quizSet.rounds = quizSet.rounds.filter(round => round.roundNumber !== roundNumToDelete);
        // Reassign round numbers sequentially (1, 2, 3...)
        quizSet.rounds.forEach((round, idx) => {
            round.roundNumber = idx + 1;
        });
        quizSet.totalRounds = quizSet.rounds.length; // Update total rounds count
        await quizSet.save();

        res.status(200).json({ message: 'Round deleted and rounds renumbered successfully.', rounds: quizSet.rounds });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting round.', error: error.message });
    }
    
});

export default DeleteRound ;
