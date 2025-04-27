import express from 'express';
import ParticipantsDetails from '../../models/Participants/ParticipantsDetails.js';

const DeleteAllTeams = express.Router();

// Route: Delete all teams
DeleteAllTeams.delete('/delete-all-teams', async (req, res) => {
  try {
    const result = await ParticipantsDetails.deleteMany({});
    return res.status(200).json({ msg: "All teams deleted successfully", deletedCount: result.deletedCount });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default DeleteAllTeams;
