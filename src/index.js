import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import planRoutes from "./routes/plan.js";
import workoutRoutes from "./routes/workout.js";
import analyticsRoutes from "./routes/analytics.js";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/plan", planRoutes);
app.use("/workout", workoutRoutes);
app.use("/analytics", analyticsRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
