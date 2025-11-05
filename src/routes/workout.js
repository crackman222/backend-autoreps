import express from 'express';
import prisma from '../prisma.js';
import auth from '../middleware/auth.js';
const router = express.Router();

// SAVE WORKOUT
router.post("/", auth, async (req, res) => {
  const { reps, duration } = req.body;

  const data = await prisma.workout.create({
    data: {
      reps,
      duration,
      userId: req.user.id
    }
  });

  res.json(data);
});

// GET USER WORKOUT HISTORY
router.get("/", auth, async (req, res) => {
  const data = await prisma.workout.findMany({
    where: { userId: req.user.id },
    orderBy: { timestamp: 'desc' }
  });
  res.json(data);
});

export default router;
