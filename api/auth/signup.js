import bcrypt from "bcryptjs";
import { connectDB } from "../db.js";
import { Member } from "../models.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { name, email, password } = req.body;

    const exists = await Member.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    await Member.create({ name, email, password: hash });

    res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
