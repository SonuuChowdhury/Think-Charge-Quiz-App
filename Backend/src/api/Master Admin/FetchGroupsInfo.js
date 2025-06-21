import express from "express";
import ParticipantsDetails from "../../models/Participants/ParticipantsDetails.js";
import QuizManagementDetailsSchema from "../../models/Admins/QuizManageMentDetails.js";

const FetchGroupsInfo = express.Router();

FetchGroupsInfo.get('/fetch-groups-info', async (req, res) => {
  try {
    // Fetch all participants
    const participants = await ParticipantsDetails.find({}, "groupName");

    // Fetch quiz management details
    const quizDetails = await QuizManagementDetailsSchema.findOne({});

    // Count teams in each group
    const groupCounts = {};
    participants.forEach((participant) => {
      const group = participant.groupName || "Unknown";
      groupCounts[group] = (groupCounts[group] || 0) + 1;
    });

    // Get quiz times for each group
    const groupTimes = {};
    if (quizDetails && quizDetails.StartQuizOn) {
      quizDetails.StartQuizOn.forEach((item) => {
        groupTimes[item.groupName] = item.startTime;
      });
    }

    // Format as array of { groupName, teamCount, startTime }
    const groupsInfo = Object.entries(groupCounts).map(([groupName, teamCount]) => ({
      groupName,
      teamCount,
      startTime: groupTimes[groupName] || null,
    }));

    return res.status(200).json({
      success: true,
      groups: groupsInfo,
    });
  } catch (error) {
    console.error('Error fetching group info:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch group info',
      error: error.message,
    });
  }
});

export default FetchGroupsInfo;

