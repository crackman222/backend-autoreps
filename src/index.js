import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoute from './routes/auth.js';
import workoutRoute from './routes/workout.js';
import analyticsRoute from './routes/analytics.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/workout", workoutRoute);
app.use("/analytics", analyticsRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
