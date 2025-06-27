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

        // Delete the quiz set
        const result = await QuestionsDetailsSchema.deleteOne({ setName });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Quiz set not found.' });
        }

        // Re-fetch all sets, sort by setName, and reassign set names sequentially (S01, S02, ...)
        const allSets = await QuestionsDetailsSchema.find({}).sort({ setName: 1 });
        const bulkOps = [];
        for (let i = 0; i < allSets.length; i++) {
            const newSetName = `S${String(i + 1).padStart(2, '0')}`;
            if (allSets[i].setName !== newSetName) {
                bulkOps.push({
                    updateOne: {
                        filter: { _id: allSets[i]._id },
                        update: { $set: { setName: newSetName } }
                    }
                });
            }
        }
        if (bulkOps.length > 0) {
            await QuestionsDetailsSchema.bulkWrite(bulkOps);
        }

        res.status(200).json({ message: 'Quiz set deleted and sets renumbered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quiz set.', error: error.message });
    }
    
});

export default DeleteSet ;
