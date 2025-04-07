import express from 'express';
import AttendanceDetailsSchema from '../../models/Participants/AttendanceDetails.js';
import ParticipantsDetails from '../../models/Participants/ParticipantsDetails.js';
import GetCurrentIST from '../../../Demo/GetCurrentIST.js';
import QuizManagementDetailsSchema from '../../models/Admins/QuizManageMentDetails.js';
import GetSetNumber from '../../../Demo/GetSetNumber.js'

const MarkTeamPresent = express.Router();
MarkTeamPresent.use(express.json());

MarkTeamPresent.post('/mark-present', async (req, res) => {
  try {
    const { teamName, mobile, PresentMembers, isAllPresent } = req.body;

    if (!teamName || !mobile || isAllPresent === undefined) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const mobileNumber = Number(mobile);
    const teamNameString = String(teamName);

    // Fetch participant details
    const participant = await ParticipantsDetails.findOne({ mobile: mobileNumber });

    if (!participant) {
      return res.status(404).json({ msg: "Participant not found" });
    }

    const existingAttendance = await AttendanceDetailsSchema.findOne({
      mobile: mobileNumber,
      teamName: teamNameString,
    });

    if (existingAttendance) {
      return res.status(409).json({ msg: "Attendance already marked" });
    }

    // Get current IST timestamp
    const EnteredOn = await GetCurrentIST();

    let finalPresentMembers = [];

    if (!isAllPresent) {
      if (!PresentMembers || !Array.isArray(PresentMembers)) {
        return res.status(400).json({ msg: "PresentMembers must be an array of names when isAllPresent is false" });
      }

      // Match provided names with teamMembers
      const membersMap = new Map(participant.teamMembers.map(member => [member.name, member.role]));

      finalPresentMembers = PresentMembers.map(name => {
        if (membersMap.has(name)) {
          return { name, role: membersMap.get(name) };
        } else {
          return null;
        }
      }).filter(member => member !== null);

      // If some names didn't match, return an error
      const unmatchedNames = PresentMembers.filter(name => !membersMap.has(name));
      if (unmatchedNames.length > 0) {
        return res.status(400).json({ msg: "Invalid members in PresentMembers", unmatchedNames });
      }
    }

    const QuizSettingsDetails = await QuizManagementDetailsSchema.findOne();
    const SetToBeAssigned = await GetSetNumber(QuizSettingsDetails.LastSetAssigned);

    QuizSettingsDetails.LastSetAssigned = SetToBeAssigned;
    await QuizSettingsDetails.save();

    

    // Create attendance entry
    const attendanceEntry = new AttendanceDetailsSchema({
      teamName: teamNameString,
      mobile: mobileNumber,
      EnteredOn,
      setAssigned:SetToBeAssigned,
      isAllPresent,
      PresentMembers: finalPresentMembers // Empty array if all present, else filtered list
    });

    // Save to database
    await attendanceEntry.save();

    return res.status(201).json({ msg: "Attendance marked successfully" });

  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default MarkTeamPresent;
