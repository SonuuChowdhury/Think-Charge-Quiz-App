import express from "express";
import GetCurrentISTDate from "../../../../Demo/GetCurrentISTDate.js";
import GenerateStationaryTaskData from "../../../../Demo/GenerateStationaryTaskData.js";
import GenerateDynamicTaskData from "../../../../Demo/GenerateDynamicTaskData.js";
import QuestionsDetailsSchema from "../../../models/Participants/QuestionsDetailsSchema.js";
import ResultsDetailsSchema from "../../../models/Participants/ResultsDetails.js";

const CheckAnswer = express.Router();

CheckAnswer.put("/check-answer", async (req, res) => {
  const user = req.user;
  const userinfo = req.userinfo;
  const { answer } = req.body;

  const resultData = await ResultsDetailsSchema.findOne({
    mobile: user.mobile,
  });
  if (!resultData) {
    return res
      .status(404)
      .json({ message: "Result data not found for the participant." });
  }

  let nextRoundNumber = resultData.roundInfo.length + 1;
  if (nextRoundNumber == 2) {
    const PrevRoundCompleted = resultData.roundInfo.some(
      (info) => info.roundNumber === "R1" && info.endTime !== null
    );
    if (!PrevRoundCompleted) {
      nextRoundNumber = 1;
    }
  }
  if (nextRoundNumber == 3) {
    const PrevRoundCompleted = resultData.roundInfo.some(
      (info) => info.roundNumber === "R2" && info.endTime !== null
    );
    if (!PrevRoundCompleted) {
      nextRoundNumber = 2;
    }
  }

  if (nextRoundNumber == 4) {
    const PrevRoundCompleted = resultData.roundInfo.some(
      (info) => info.roundNumber === "R3" && info.endTime !== null
    );
    if (!PrevRoundCompleted) {
      nextRoundNumber = 3;
    } else {
      return res.status(200).json({
        isQuizCompleted: true,
        battery: resultData.batteryStatus,
        numberOfHintsUsed: resultData.numberOfHintsUsed,
        numberOfWrongAttempts: resultData.numberOfWrongAttempts,
        message: "All Rounds Completed successfully.",
      });
    }
  }

  let answerIsCorrect = false;

  const questionData = await QuestionsDetailsSchema.findOne({
    setName: userinfo.setAssigned,
    "rounds.roundNumber": nextRoundNumber,
  });
  if (!questionData || !questionData.rounds || questionData.rounds.length === 0) {
    return res.status(404).json({ message: `No questions found for Round ${nextRoundNumber}.` });
  }
  let data = questionData.rounds.filter(
    (round) => round.roundNumber === nextRoundNumber
  );
  if (!data || data.length === 0) {
    return res.status(404).json({ message: `No round ${nextRoundNumber} data found.` });
  }
  const questionType = data[0].questionType;
  // --- MCQ Logic ---
  if (questionType === "MCQ") {
    const correctOptions = data[0].correctOptions;
    if (!Array.isArray(correctOptions) || correctOptions.length === 0) {
      return res.status(400).json({ message: 'No correct options available for this question.' });
    }
    // Always treat answer as string, check inclusion
    if (typeof answer === 'string' && correctOptions.includes(answer)) {
      answerIsCorrect = true;
    }
  }
  // --- Numerical Logic ---
  if (questionType === "Numerical") {
    const numericAnswer = data[0].numericAnswer;
    const numAnswer = Number(answer);
    // Use tolerance for float answers
    if (typeof numericAnswer === 'number' && Math.abs(numericAnswer - numAnswer) < 1e-6) {
      answerIsCorrect = true;
    }
  }

  // --- Attempt Limiting Logic ---
  const StationaryData = await GenerateStationaryTaskData(
    userinfo.setAssigned,
    `R${nextRoundNumber}`
  );
  let dynamicTaksKey = "";
  if (questionType === "MCQ" && answerIsCorrect === false) {
    dynamicTaksKey = "wrongmcq";
  } else if (questionType === "MCQ" && answerIsCorrect === true) {
    dynamicTaksKey = "correctmcq";
  } else if (questionType === "Numerical" && answerIsCorrect === false) {
    dynamicTaksKey = "wrongnumber";
  } else if (questionType === "Numerical" && answerIsCorrect === true) {
    dynamicTaksKey = "correctnumber";
  }
  const dynamicTaskData = await GenerateDynamicTaskData(dynamicTaksKey);
  const taskString = `${StationaryData}${dynamicTaskData}`;
  // Extract the last 11 characters (S02R303UHXX) from taskString
  const taskCode = taskString.slice(-11);
  // Check if any entry in taskHistory ends with the same code
  const similarItems = resultData.taskHistory.filter(
    (item) => item.slice(-11) === taskCode
  );
  const attemptsUsed = similarItems.length;
  const LimitReached = attemptsUsed >= 2;
  let battery = resultData.batteryStatus;
  if (LimitReached) {
    return res.status(400).json({
      message: "Limit Reached! You can only answer 2 times.",
      battery: battery,
      numberOfHintsUsed: resultData.numberOfHintsUsed,
      numberOfWrongAttempts: resultData.numberOfWrongAttempts,
      AttemptUsed: attemptsUsed,
    });
  }
  // Only push new attempt if not already present for this attempt
  if (!similarItems.some(item => item === taskString)) {
    resultData.taskHistory.push(taskString);
  }

  // --- Battery and Attempt Handling ---
  let AttemptUsed = attemptsUsed + 1;
  if (!answerIsCorrect) {
    battery = battery - 2;
    resultData.batteryStatus = battery;
    resultData.numberOfWrongAttempts = resultData.numberOfWrongAttempts + 1;
    await resultData.save();
    if (AttemptUsed === 2) {
      const currentISTDate = await GetCurrentISTDate();
      const roundIndex = resultData.roundInfo.findIndex(
        (info) => info.roundNumber === `R${nextRoundNumber}`
      );
      if (roundIndex !== -1) {
        resultData.roundInfo[roundIndex].endTime = currentISTDate;
        await resultData.save();
      }
    }
    return res.status(400).json({
      message: "Wrong Answer. Battery Drained by 2%.",
      AttemptUsed: AttemptUsed,
      numberOfHintsUsed: resultData.numberOfHintsUsed,
      numberOfWrongAttempts: resultData.numberOfWrongAttempts,
      battery: battery,
    });
  } else {
    // Correct answer
    const currentISTDate = await GetCurrentISTDate();
    const roundIndex = resultData.roundInfo.findIndex(
      (info) => info.roundNumber === `R${nextRoundNumber}`
    );
    if (roundIndex !== -1) {
      resultData.roundInfo[roundIndex].endTime = currentISTDate;
      await resultData.save();
    }
    return res.status(200).json({
      message: "Correct Answer. Battery is not Drained.",
      AttemptUsed: AttemptUsed,
      numberOfHintsUsed: resultData.numberOfHintsUsed,
      numberOfWrongAttempts: resultData.numberOfWrongAttempts,
      battery: battery,
    });
  }
});

export default CheckAnswer;
