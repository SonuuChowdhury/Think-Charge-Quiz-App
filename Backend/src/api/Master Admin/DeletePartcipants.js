import express from 'express';
import ParticipantsDetails from '../../models/Participants/ParticipantsDetails.js';

const DeleteParticipant = express.Router();

DeleteParticipant.delete('/delete-participants/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedParticipant = await ParticipantsDetails.findByIdAndDelete(id);

    if (!deletedParticipant) {
      return res.status(404).json({ msg: "Participant not found" });
    }

    return res.status(200).json({ msg: "Participant deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default DeleteParticipant;
