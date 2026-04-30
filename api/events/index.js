import { connectDB } from "../db.js";
import { Session } from "../models.js";

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === "GET") {
      const data = await Session.find().sort({ date: 1 });
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const data = req.body;
      data.totalSeats = data.totalSeats || 50;
      data.seatsLeft = data.totalSeats;

      await Session.create(data);
      return res.status(201).json({ message: "Event added" });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
