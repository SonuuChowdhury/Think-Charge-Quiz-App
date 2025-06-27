import express from 'express';
import QuestionsDetailsSchema from '../../../models/Participants/QuestionsDetailsSchema.js';

const AddSet = express.Router();

AddSet.post('/add-set', async (req, res) => {
    try {
        // Fetch all existing sets
        const existingSets = await QuestionsDetailsSchema.find({}, 'setName');
        const setNames = existingSets.map(s => s.setName);
        // Only allow up to S04
        if (setNames.length >= 4) {
            return res.status(400).json({ message: 'No more than 4 sets (S01-S04) can be created.' });
        }
        // Find the next available set name
        let nextSetNumber = 1;
        while (setNames.includes(`S0${nextSetNumber}`) && nextSetNumber <= 4) {
            nextSetNumber++;
        }
        if (nextSetNumber > 4) {
            return res.status(400).json({ message: 'No more than 4 sets (S01-S04) can be created.' });
        }
        const setName = `S0${nextSetNumber}`;

        const newSet = new QuestionsDetailsSchema({
            setName,
            totalRounds: 0, // Initialize with 0 rounds
            rounds: [] // Initialize with an empty array of rounds
        });

        await newSet.save();

        res.status(201).json({ message: `Quiz set ${setName} created successfully with no questions.`, set: newSet });
    } catch (error) {
        res.status(500).json({ message: 'Error creating quiz set.', error: error.message });
    }
});

export default AddSet ;
