import express from 'express';
import AttendanceDetailsSchema from '../../models/Participants/AttendanceDetails.js';

const router = express.Router();

router.post('/ban-team/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;
    console.log(`Ban Request of Mobile number: ${mobile}`);

    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    const team = await AttendanceDetailsSchema.findOne({ mobile: Number(mobile) });
    console.log(`Team found: ${team}`);
    

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.isBanned = true;
    await team.save();

    res.status(200).json({ message: 'Team banned successfully' });
  } catch (error) {
    console.error('Error banning team:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
