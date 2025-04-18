import express from 'express';
import ParticipantsDetails from '../../models/Participants/ParticipantsDetails.js';

const DeleteParticipant = express.Router();

// Route: Delete participant using mobile number
DeleteParticipant.delete('/delete-participants/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;
    const MobileNumbers = Number(mobile)

    const deletedParticipant = await ParticipantsDetails.findOneAndDelete({ mobile });

    if (!deletedParticipant) {
      return res.status(404).json({ msg: "Participant not found with the provided mobile number" });
    }

    return res.status(200).json({ msg: "Participant deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default DeleteParticipant;
