import express from 'express';
import QuestionsDetailsSchema from '../../../models/Participants/QuestionsDetailsSchema.js';

const DeleteSet = express.Router();

DeleteSet.delete('/delete-set/:setName', async (req, res) => {
    try {
        const { setName } = req.params;
        if (!setName) {
            return res.status(400).json({ message: 'setName is required.' });
        }

        // Validate setName format: S01, S02, S03, etc.
        const setNamePattern = /^S\d{2}$/;
        if (!setNamePattern.test(setName)) {
            return res.status(400).json({ message: 'setName must be in the format S01, S02, S03, etc.' });
        }

        // Find the quiz set by setName
        // Find and delete the quiz set in a single operation
        const result = await QuestionsDetailsSchema.deleteOne({ setName });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Quiz set not found.' });
        }

        res.status(200).json({ message: 'Quiz set deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quiz set.', error: error.message });
    }
    
});

export default DeleteSet ;
