import express from 'express';
import AttendanceDetailsSchema from '../../models/Participants/AttendanceDetails.js';
import ParticipantsDetails from '../../models/Participants/ParticipantsDetails.js';
import QuizManagementDetailsSchema from '../../models/Admins/QuizManageMentDetails.js';
import GetCurrentISTDate from '../../../Demo/GetCurrentISTDate.js';

const FetchAllAttendanceDetails = express.Router();
FetchAllAttendanceDetails.use(express.json());

FetchAllAttendanceDetails.post('/fetch-attendance', async (req, res) => {
  try {
    const { groupName } = req.body;
    if (!groupName) {
      return res.status(400).json({ msg: 'Group name is required in the request body.' });
    }

    // Fetch the latest quiz settings
    const quizSettings = await QuizManagementDetailsSchema.findOne();
    if (!quizSettings || !Array.isArray(quizSettings.StartQuizOn)) {
      return res.status(404).json({ msg: 'Quiz settings or group start times not found.' });
    }

    // Find the start time for the requested group
    const groupInfo = quizSettings.StartQuizOn.find(g => g.groupName === groupName);
    if (!groupInfo || !groupInfo.startTime) {
      return res.status(404).json({ msg: `Start time for group '${groupName}' not found.` });
    }

    // Get current IST time
    const nowIST = GetCurrentISTDate();
    const startTime = new Date(groupInfo.startTime);
    const windowStart = new Date(startTime.getTime() - 30 * 60 * 1000); // 30 min before
    const windowEnd = new Date(startTime.getTime() + 15 * 60 * 1000); // 15 min after

    if (nowIST < windowStart || nowIST > windowEnd) {
      return res.status(403).json({
        msg: `Attendance for group '${groupName}' can only be fetched between ${windowStart.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} and ${windowEnd.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}. Current time: ${nowIST.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
      });
    }

    // Fetch all teams in the group and their attendance
    const [allTeams, allAttendance] = await Promise.all([
      ParticipantsDetails.find({ groupName }).lean(),
      AttendanceDetailsSchema.find().lean()
    ]);

    if (!allTeams.length) {
      return res.status(404).json({ msg: `No teams found for group '${groupName}'.` });
    }

    // Create a map for quick attendance lookup
    const attendanceMap = new Map(
      allAttendance.map(entry => [entry.mobile, entry])
    );

    // Process each team's data
    const teamReports = allTeams.map(team => {
      const attendanceEntry = attendanceMap.get(team.mobile);
      const teamMembers = team.teamMembers;

      // Default values for teams without attendance
      let status = 'Absent'; 
      let presentMembers = [];
      let absentMembers = [...teamMembers];
      let isPresent = false;
      let enteredOn = null;
      let SetAssigned = null;

      if (attendanceEntry) {
        isPresent = true;
        status = attendanceEntry.isAllPresent ? 'All Present' : 'Partial Present';
        enteredOn = attendanceEntry.EnteredOn;
        SetAssigned = attendanceEntry.setAssigned;

        if (attendanceEntry.isAllPresent) {
          presentMembers = [...teamMembers];
          absentMembers = [];
        } else {
          presentMembers = teamMembers.filter(member => 
            attendanceEntry.PresentMembers.some(p => p.name === member.name)
          );
          absentMembers = teamMembers.filter(member => 
            !presentMembers.some(p => p.name === member.name)
          );
        }
      }

      return {
        teamName: team.teamName,
        mobile: team.mobile,
        status,
        isPresent,
        enteredOn,
        SetAssigned,
        presentCount: presentMembers.length,
        absentCount: absentMembers.length,
        presentMembers: presentMembers.map(m => ({
          name: m.name,
          role: m.role,
          department: m.department
        })),
        absentMembers: absentMembers.map(m => ({
          name: m.name,
          role: m.role,
          department: m.department
        }))
      };
    });

    return res.status(200).json({
      totalTeams: allTeams.length,
      reports: teamReports,
      startTime: groupInfo.startTime,
    });

  } catch (error) {
    return res.status(500).json({ 
      msg: 'Server Error', 
      error: error.message
    });
  }
});

export default FetchAllAttendanceDetails;
