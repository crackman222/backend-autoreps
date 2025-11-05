import express from "express";
import prisma from "../prisma.js";
const router = express.Router();

// Get plan
router.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const plan = await prisma.trainingPlan.findUnique({
    where: { userId },
  });
  res.json(plan);
});

// Create or update plan
router.post("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const { planName, reps, sets, formStatus } = req.body;

  const plan = await prisma.trainingPlan.upsert({
    where: { userId },
    update: { planName, reps, sets, formStatus },
    create: { userId, planName, reps, sets, formStatus },
  });

  res.json(plan);
});

export default router;
