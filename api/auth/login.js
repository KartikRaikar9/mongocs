import bcrypt from "bcryptjs";
import { connectDB } from "../db.js";
import { Member } from "../models.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { email, password } = req.body;

    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(400).json({ error: "User not found" });
    }

    const ok = await bcrypt.compare(password, member.password);
    if (!ok) {
      return res.status(400).json({ error: "Wrong password" });
    }

    res.status(200).json({ name: member.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
