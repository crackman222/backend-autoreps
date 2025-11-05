import express from 'express';
import prisma from '../prisma.js';
import auth from '../middleware/auth.js';
const router = express.Router();

// Total reps & total workout count
router.get("/summary", auth, async (req, res) => {
  const totalReps = await prisma.workout.aggregate({
    _sum: { reps: true },
    where: { userId: req.user.id }
  });

  const totalSessions = await prisma.workout.count({
    where: { userId: req.user.id }
  });

  res.json({
    total_reps: totalReps._sum.reps || 0,
    total_sessions: totalSessions
  });
});

// Weekly / Last 7 Days
router.get("/weekly", auth, async (req, res) => {
  const data = await prisma.$queryRaw`
    SELECT date(timestamp) as day, SUM(reps) as reps
    FROM "Workout"
    WHERE "userId" = ${req.user.id}
      AND timestamp > NOW() - interval '7 days'
    GROUP BY day
    ORDER BY day ASC;
  `;
  res.json(data);
});

export default router;
