import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    // Check if token is blacklisted
    const blacklisted = await prisma.tokenBlacklist.findUnique({
      where: { token },
    });

    if (blacklisted) {
      return res.status(401).json({ error: "Token has been invalidated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    req.token = token; // Store token for logout
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}
