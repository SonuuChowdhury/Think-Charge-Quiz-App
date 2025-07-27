import express from "express";
import ResultsDetailsSchema from "../../../models/Participants/ResultsDetails.js";

const GetQuizResultData = express.Router();

GetQuizResultData.get("/get-result-data", async (req, res) => {
  const user = req.user;

  const resultData = await ResultsDetailsSchema.findOne({
    mobile: user.mobile,
  });
  if (!resultData) {
    return res
      .status(404)
      .json({ message: "Result data not found for the participant." });
  }

  return res.status(200).json({
    battery: resultData.batteryStatus,
    numberOfHintsUsed: resultData.numberOfHintsUsed,
    numberOfWrongAttempts: resultData.numberOfWrongAttempts,
  });
});

export default GetQuizResultData;
