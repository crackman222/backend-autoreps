import express from "express";
import prisma from "../prisma.js";
const router = express.Router();

// Add workout session
router.post("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const { reps, validReps, invalidReps, durationSec } = req.body;

  const session = await prisma.workoutSession.create({
    data: { userId, reps, validReps, invalidReps, durationSec },
  });

  res.json(session);
});

// Get all sessions for analytics
router.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const sessions = await prisma.workoutSession.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  res.json(sessions);
});

export default router;
