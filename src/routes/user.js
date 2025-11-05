import express from "express";
import prisma from "../prisma.js";
const router = express.Router();

// Get profile
router.get("/profile/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  res.json(profile);
});

// Update or create profile
router.post("/profile/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const { age, weight, primaryGoal, experienceLevel } = req.body;

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: { age, weight, primaryGoal, experienceLevel },
    create: { userId, age, weight, primaryGoal, experienceLevel },
  });

  res.json(profile);
});

export default router;
