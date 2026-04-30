import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/* MongoDB */
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventDB";
let cached = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri).then(() => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

/* Models */
const memberSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const sessionSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  category: String,
  image: String,
  favorite: { type: Boolean, default: false },
  rsvp: { type: String, default: "Interested" },
  totalSeats: { type: Number, default: 50 },
  seatsLeft: { type: Number, default: 50 }
});

const Member = mongoose.models.Member || mongoose.model("Member", memberSchema, "users");
const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema, "events");

/* Auth Routes */
app.post("/api/auth/signup", async (req, res) => {
  try {
    await connectDB();
    const { name, email, password } = req.body;

    const exists = await Member.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    await Member.create({ name, email, password: hash });

    res.json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;

    const member = await Member.findOne({ email });
    if (!member) return res.status(400).json({ error: "User not found" });

    const ok = await bcrypt.compare(password, member.password);
    if (!ok) return res.status(400).json({ error: "Wrong password" });

    res.json({ name: member.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Events Routes */
app.get("/api/events", async (req, res) => {
  try {
    await connectDB();
    const data = await Session.find().sort({ date: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    await connectDB();
    const data = req.body;
    data.totalSeats = data.totalSeats || 50;
    data.seatsLeft = data.totalSeats;

    await Session.create(data);
    res.status(201).json({ message: "Event added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/events/:id", async (req, res) => {
  try {
    await connectDB();
    await Session.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Event updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    await connectDB();
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/events/book", async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ error: "Event not found" });

    const today = new Date().toISOString().split("T")[0];
    if (session.date < today) return res.status(400).json({ error: "Cannot book past events" });
    if (session.seatsLeft <= 0) return res.status(400).json({ error: "No seats left" });

    session.seatsLeft -= 1;
    await session.save();

    res.json({ message: "Booking confirmed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/events/favorite", async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ error: "Event not found" });

    session.favorite = !session.favorite;
    await session.save();

    res.json({ message: "Favorite updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/events/rsvp", async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ error: "Event not found" });

    await Session.findByIdAndUpdate(id, { rsvp: req.body.rsvp });

    res.json({ message: "RSVP updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Static Pages */
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "public", "signup.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📝 Login: http://localhost:${PORT}/login`);
  console.log(`📝 Dashboard: http://localhost:${PORT}/dashboard`);
});
