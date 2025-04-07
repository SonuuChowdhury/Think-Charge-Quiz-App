import express from 'express';
import ParticipantsDetails from '../../models/Participants/ParticipantsDetails.js';
import hashPassword from '../../../Demo/HashPassword.js';
import GetCureentIST from '../../../Demo/GetCurrentIST.js';

const AddParticipant = express.Router();
AddParticipant.use(express.json());

AddParticipant.post('/add-participant', async (req, res) => {
  try {
    const { teamName, email, mobile, teamMembers } = req.body;

    // Check if required fields are present
    if (!teamName || !mobile || !teamMembers || !email || !Array.isArray(teamMembers)) {
      return res.status(400).json({ msg: "Required data is missing or incorrect" });
    }

    // Validate teamMembers array length
    if (teamMembers.length < 3 || teamMembers.length > 4) {
      return res.status(400).json({ msg: "Team members must be between 3 and 4" });
    }

    // Validate each team member's structure
    const isValidTeamMembers = teamMembers.every(member => 
      member.name && 
      member.department && 
      member.sem && 
      member.gender && 
      ['Male', 'Female'].includes(member.gender) && 
      member.role
    );

    if (!isValidTeamMembers) {
      return res.status(400).json({ msg: "Each team member must have valid name, department, sem, gender (Male/Female), and role" });
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
      email,
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
