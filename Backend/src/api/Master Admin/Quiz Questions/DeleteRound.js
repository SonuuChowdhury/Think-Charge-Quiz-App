import express from 'express';
import QuestionsDetailsSchema from '../../../models/Participants/QuestionsDetailsSchema.js';

const DeleteRound = express.Router();

DeleteRound.delete('/delete-round/:setName/:roundName', async (req, res) => {
    try {
        const { setName, roundName } = req.params;
        if (!setName || !roundName) {
            return res.status(400).json({ message: 'Set name and round name are required.' });
        }

        // Validate roundName format: R01, R02, R03, etc.
        const roundNamePattern = /^R\d{2}$/;
        if (!roundNamePattern.test(roundName)) {
            return res.status(400).json({ message: 'Round name must be in the format R01, R02, R03, etc.' });
        }
        // Validate setName format: S01, S02, S03, etc.
        const setNamePattern = /^S\d{2}$/;
        if (!setNamePattern.test(setName)) {
            return res.status(400).json({ message: 'Set name must be in the format S01, S02, S03, etc.' });
        }

        // Find the quiz set by setName
        const quizSet = await QuestionsDetailsSchema.findOne({ setName });
        if (!quizSet) {
            return res.status(404).json({ message: 'Quiz set not found.' });
        }

        // Remove the round from the quiz set
        quizSet.rounds = quizSet.rounds.filter(round => round.roundNumber !== roundName);
        quizSet.totalRounds = quizSet.rounds.length; // Update total rounds count
        await quizSet.save();

        res.status(200).json({ message: 'Round deleted successfully.', rounds: quizSet.rounds });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting round.', error: error.message });
    }
    
});

export default DeleteRound ;
