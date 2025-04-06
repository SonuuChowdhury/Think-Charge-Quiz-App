import express from 'express';
import ParticipantsDetails from '../../models/Participants/ParticipantsDetails.js';

const GetTeamDetails = express.Router();
GetTeamDetails.use(express.json());

GetTeamDetails.get('/fetch-team/:mobile', async (req, res) => {
  try {
    // Convert the mobile number to a number
    const mobileNumber = parseInt(req.params.mobile);

    // Fetch data from MongoDB
    const teamDetails = await ParticipantsDetails.findOne({ mobile: mobileNumber });

    if (!teamDetails) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Extract team name and members' names
    const teamName = teamDetails.teamName;
    const membersList = teamDetails.teamMembers.map(member => member.name);

    // Return the team name and members list
    res.json({ teamName, membersList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default GetTeamDetails;
