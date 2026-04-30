import { connectDB } from "../db.js";
import { Session } from "../models.js";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ error: "Event not found" });
    }

    await Session.findByIdAndUpdate(id, { rsvp: req.body.rsvp });

    res.status(200).json({ message: "RSVP updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
