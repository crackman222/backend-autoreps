import express from 'express';
import prisma from '../prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hash }
    });
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: "Email already used" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user });
});

// LOGOUT
router.post("/logout", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Decode token to get expiration time
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    // Add token to blacklist
    await prisma.tokenBlacklist.create({
      data: {
        token,
        expiresAt,
      },
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
});

export default router;
