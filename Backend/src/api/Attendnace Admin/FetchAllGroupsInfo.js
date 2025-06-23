import express from "express";
import ParticipantsDetails from "../../models/Participants/ParticipantsDetails.js";
import QuizManagementDetailsSchema from "../../models/Admins/QuizManageMentDetails.js";

const FetchAllGroupsInfo = express.Router();

FetchAllGroupsInfo.get('/fetch-all-groups-info', async (req, res) => {
    try {
        // Fetch all participants
        const participants = await ParticipantsDetails.find({}, "groupName");

        // Fetch quiz management details
        const quizDetails = await QuizManagementDetailsSchema.findOne({});

        // Collect group names from participants
        const participantGroups = new Set(participants.map(p => p.groupName || "Unknown"));

        // Collect group names from quizDetails
        const quizGroups = new Set();
        const groupTimes = {};
        if (quizDetails && quizDetails.StartQuizOn) {
            quizDetails.StartQuizOn.forEach((item) => {
                quizGroups.add(item.groupName);
                groupTimes[item.groupName] = item.startTime;
            });
        }

        // Merge all group names
        const allGroups = new Set([...participantGroups, ...quizGroups]);

        // Count teams in each group
        const groupCounts = {};
        participants.forEach((participant) => {
            const group = participant.groupName || "Unknown";
            groupCounts[group] = (groupCounts[group] || 0) + 1;
        });

        // Format as array of { groupName, teamCount, startTime }
        const groupsInfo = Array.from(allGroups).map((groupName) => ({
            groupName,
            teamCount: groupCounts[groupName] || 0,
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

export default FetchAllGroupsInfo;
