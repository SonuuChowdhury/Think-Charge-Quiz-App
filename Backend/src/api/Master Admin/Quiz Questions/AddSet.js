import express from 'express';
import QuestionsDetailsSchema from '../../../models/Participants/QuestionsDetailsSchema.js';

const AddSet = express.Router();

AddSet.post('/add-set', async (req, res) => {
    try {
        const { setName } = req.body;
        if (!setName) {
            return res.status(400).json({ message: 'setName is required.' });
        }

        // Validate setName format: S01, S02, S03, etc.
        const setNamePattern = /^S\d{2}$/;
        if (!setNamePattern.test(setName)) {
            return res.status(400).json({ message: 'setName must be in the format S01, S02, S03, etc.' });
        }

        const newSet = new QuestionsDetailsSchema({
            setName,
            totalRounds: 0, // Initialize with 0 rounds
            rounds: [] // Initialize with an empty array of rounds
        });

        await newSet.save();

        res.status(201).json({ message: 'Quiz set created successfully with no questions.', set: newSet });
    } catch (error) {
        res.status(500).json({ message: 'Error creating quiz set.', error: error.message });
    }
});

export default AddSet ;
