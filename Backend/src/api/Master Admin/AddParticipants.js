import express from 'express';
import ParticipantsDetails from '../../models/Participants/ParticipantsDetails.js';
import hashPassword from '../../../Demo/HashPassword.js';
import GetCureentIST from '../../../Demo/GetCurrentIST.js';

const AddParticipant = express.Router();
AddParticipant.use(express.json());

AddParticipant.post('/add-participant', async (req, res) => {
  try {
    const { teamName, mobile, teamMembers } = req.body;

    if (!teamName || !mobile || !teamMembers || !Array.isArray(teamMembers)) {
      return res.status(400).json({ msg: "Required data is missing or incorrect" });
    }

    // Check if team name already exists
    const existingTeam = await ParticipantsDetails.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({ msg: "Team name already exists" });
    }

    // Check if mobile number already exists
    const existingMobile = await ParticipantsDetails.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({ msg: "Mobile number already registered" });
    }

    // Generate password using first 5 digits of mobile + '@password'
    const GenPassword = mobile.toString().slice(0, 5) + "@password";

    // Create new participant entry
    const newParticipant = new ParticipantsDetails({
      teamName,
      mobile,
      password: await hashPassword(GenPassword),
      joined: await GetCureentIST(),
      teamMembers,
    });

    await newParticipant.save();
    return res.status(201).json({ msg: "Participant added successfully" });

  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default AddParticipant;
