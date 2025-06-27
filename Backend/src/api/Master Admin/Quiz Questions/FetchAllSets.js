import express from 'express';
import QuestionsDetailsSchema from '../../../models/Participants/QuestionsDetailsSchema.js';

const FetchAllSet = express.Router();

FetchAllSet.get('/fetch-all-set', async (req, res) => {
    try {
        const sets = await QuestionsDetailsSchema.find({});
        if (!sets || sets.length === 0) {
            return res.status(404).json({ message: 'No quiz sets found.' });
        }
        res.status(200).json({ message: 'Quiz sets fetched successfully.', sets });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz sets.', error: error.message });
    }
});

export default FetchAllSet ;
