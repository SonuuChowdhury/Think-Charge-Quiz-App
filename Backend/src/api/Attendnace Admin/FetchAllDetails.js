import express from 'express';
import AttendanceDetailsSchema from '../../models/Participants/AttendanceDetails.js';
import ParticipantsDetails from '../../models/Participants/ParticipantsDetails.js';

const FetchAllAttendanceDetails = express.Router();
FetchAllAttendanceDetails.use(express.json());

FetchAllAttendanceDetails.post('/fetch-attendance', async (req, res) => {
  try {
    // Fetch all teams and their attendance
    const [allTeams, allAttendance] = await Promise.all([
      ParticipantsDetails.find().lean(),
      AttendanceDetailsSchema.find().lean()
    ]);

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
      let isPresent = false; // Initialize isPresent as false

      if (attendanceEntry) {
        isPresent = true; // Mark as present if attendance entry exists
        status = attendanceEntry.isAllPresent ? 'All Present' : 'Partial Present';

        if (attendanceEntry.isAllPresent) {
          presentMembers = [...teamMembers];
          absentMembers = [];
        } else {
          // Find present members by name match
          presentMembers = teamMembers.filter(member => 
            attendanceEntry.PresentMembers.some(p => p.name === member.name)
          );

          // Find absent members
          absentMembers = teamMembers.filter(member => 
            !presentMembers.some(p => p.name === member.name)
          );
        }
      }

      return {
        teamName: team.teamName,
        mobile: team.mobile,
        status,
        isPresent, // Add the isPresent field
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
      reports: teamReports
    });

  } catch (error) {
    return res.status(500).json({ 
      msg: "Server Error", 
      error: error.message
    });
  }
});

export default FetchAllAttendanceDetails;
