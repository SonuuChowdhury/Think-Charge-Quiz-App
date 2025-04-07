import express from 'express';
import ParticipantsDetails from '../../models/Participants/ParticipantsDetails.js';

const FetchTeams = express.Router();
FetchTeams.use(express.json());

FetchTeams.get('/fetch-teams', async (req, res) => {
  try {
    // Fetch all teams and exclude the password field
    const teams = await ParticipantsDetails.find().select('-password');
    
    // Send the response
    return res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch teams',
      error: error.message,
    });
  }
});

export default FetchTeams;
