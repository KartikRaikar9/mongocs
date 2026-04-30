import { connectDB } from "../db.js";
import { Session } from "../models.js";

export default async function handler(req, res) {
  try {
    await connectDB();
    const { id } = req.query;

    if (req.method === "PUT") {
      await Session.findByIdAndUpdate(id, req.body);
      return res.status(200).json({ message: "Event updated" });
    }

    if (req.method === "DELETE") {
      await Session.findByIdAndDelete(id);
      return res.status(200).json({ message: "Event deleted" });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
