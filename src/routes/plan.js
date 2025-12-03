import express from "express";
import prisma from "../prisma.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * Calculate form status based on valid/invalid reps percentage
 * @param {number} validReps - Number of valid reps
 * @param {number} invalidReps - Number of invalid reps
 * @returns {object} - { percentage: number, formStatus: string }
 */
function calculateFormStatus(validReps, invalidReps) {
  const totalReps = validReps + invalidReps;

  if (totalReps === 0) {
    return { percentage: 0, formStatus: "No Data" };
  }

  const percentage = (validReps / totalReps) * 100;

  let formStatus;
  if (percentage >= 80) {
    formStatus = "Good";
  } else if (percentage >= 50) {
    formStatus = "Average";
  } else {
    formStatus = "Bad";
  }

  return { percentage: parseFloat(percentage.toFixed(2)), formStatus };
}

// Get plan
router.get("/", auth, async (req, res) => {
  const userId = req.user.id;

  const plan = await prisma.trainingPlan.findUnique({
    where: { userId },
  });

  res.json(plan);
});

// Update or create plan
router.post("/", auth, async (req, res) => {
  const userId = req.user.id;
  const { planName, reps, sets, formStatus, validReps, invalidReps } = req.body;

  let finalFormStatus = formStatus;

  // Auto-calculate formStatus if validReps and invalidReps are provided
  if (validReps !== undefined && invalidReps !== undefined) {
    const calculation = calculateFormStatus(validReps, invalidReps);
    finalFormStatus = calculation.formStatus;
  }

  const plan = await prisma.trainingPlan.upsert({
    where: { userId },
    update: { planName, reps, sets, formStatus: finalFormStatus },
    create: { userId, planName, reps, sets, formStatus: finalFormStatus },
  });

  res.json(plan);
});

// Calculate and update form status based on valid/invalid reps
router.post("/calculate-form-status", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { validReps, invalidReps } = req.body;

    // Validate input
    if (validReps === undefined || invalidReps === undefined) {
      return res.status(400).json({
        error: "Both validReps and invalidReps are required"
      });
    }

    if (validReps < 0 || invalidReps < 0) {
      return res.status(400).json({
        error: "validReps and invalidReps must be non-negative numbers"
      });
    }

    // Calculate percentage and form status
    const calculation = calculateFormStatus(validReps, invalidReps);

    // Get existing plan or create default values
    let plan = await prisma.trainingPlan.findUnique({
      where: { userId },
    });

    // Update or create plan with calculated formStatus
    plan = await prisma.trainingPlan.upsert({
      where: { userId },
      update: { formStatus: calculation.formStatus },
      create: {
        userId,
        planName: plan?.planName || "Default Plan",
        reps: plan?.reps || 0,
        sets: plan?.sets || 0,
        formStatus: calculation.formStatus
      },
    });

    res.json({
      validReps,
      invalidReps,
      totalReps: validReps + invalidReps,
      percentage: calculation.percentage,
      formStatus: calculation.formStatus,
      plan
    });
  } catch (error) {
    console.error("Error calculating form status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
