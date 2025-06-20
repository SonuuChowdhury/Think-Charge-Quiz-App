import express from "express";
import Participants from "../../models/Participants.js";

const FetchGroupsInfo = express.Router();

FetchGroupsInfo.get('/fetch-groups-info', async (req, res) => {
  try {
    // Fetch all participants
    const participants = await Participants.find({}, "groupName");

    // Count teams in each group
    const groupCounts = {};
    participants.forEach((participant) => {
      const group = participant.groupName || "Unknown";
      groupCounts[group] = (groupCounts[group] || 0) + 1;
    });

    // Format as array of { groupName, teamCount }
    const groupsInfo = Object.entries(groupCounts).map(([groupName, teamCount]) => ({
      groupName,
      teamCount,
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

