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

    // Fetch quiz settings and group start time
    const QuizSettingsDetails = await QuizManagementDetailsSchema.findOne();
    if (!QuizSettingsDetails || !Array.isArray(QuizSettingsDetails.StartQuizOn)) {
      return res.status(404).json({ msg: 'Quiz settings or group start times not found.' });
    }
    // Find the start time for the participant's group
    const groupInfo = QuizSettingsDetails.StartQuizOn.find(g => g.groupName === participant.groupName);
    if (!groupInfo || !groupInfo.startTime) {
      return res.status(404).json({ msg: `Start time for group '${participant.groupName}' not found.` });
    }
    // Get current IST time
    const nowIST = new Date(await GetCurrentIST());
    const startTime = new Date(groupInfo.startTime);
    const windowStart = new Date(startTime.getTime() - 30 * 60 * 1000); // 30 min before
    const windowEnd = new Date(startTime.getTime() + 15 * 60 * 1000); // 15 min after
    if (nowIST < windowStart || nowIST > windowEnd) {
      return res.status(403).json({
        msg: `Attendance for group '${participant.groupName}' can only be marked between ${windowStart.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} and ${windowEnd.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}. Current time: ${nowIST.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
      });
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

    // Assign set based on participant's group name using the modified schema
    let SetToBeAssigned;
    if (QuizSettingsDetails && Array.isArray(QuizSettingsDetails.GroupSetAssignments)) {
      // Find the assignment for the participant's group
      const groupAssignment = QuizSettingsDetails.GroupSetAssignments.find(
      g => g.groupName === participant.groupName
      );
      if (groupAssignment && groupAssignment.lastSetAssigned !== undefined) {
      SetToBeAssigned = await GetSetNumber(groupAssignment.lastSetAssigned);
      // Update the lastSetAssigned for this group
      groupAssignment.lastSetAssigned = SetToBeAssigned;
      } else {
      // Fallback if group assignment not found
      SetToBeAssigned = await GetSetNumber(QuizSettingsDetails.LastSetAssigned);
      QuizSettingsDetails.LastSetAssigned = SetToBeAssigned;
      }
    } else {
      // Fallback to old logic if GroupSetAssignments is not present
      SetToBeAssigned = await GetSetNumber(QuizSettingsDetails.LastSetAssigned);
      QuizSettingsDetails.LastSetAssigned = SetToBeAssigned;
    }

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
