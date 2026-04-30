const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

const app = express();

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* MongoDB */
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventDB";
mongoose.connect(mongoUri)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* Models */
const Member = mongoose.model("Member", new mongoose.Schema({
  name: String,
  email: String,
  password: String
}), "users");

const Session = mongoose.model("Session", new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  category: String,
  image: String,
  favorite: { type: Boolean, default: false },
  rsvp: { type: String, default: "Interested" },
  totalSeats: { type: Number, default: 50 },
  seatsLeft: { type: Number, default: 50 }
}), "events");

/* Pages */
app.get("/", (req,res)=>res.sendFile(path.join(__dirname,"public","login.html")));
app.get("/signup",(req,res)=>res.sendFile(path.join(__dirname,"public","signup.html")));
app.get("/dashboard",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.get("/studio/login",(req,res)=>res.sendFile(path.join(__dirname,"public","login.html")));
app.get("/studio/signup",(req,res)=>res.sendFile(path.join(__dirname,"public","signup.html")));
app.get("/studio/dashboard",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));

/* Auth */
app.post(["/signup", "/studio/auth/signup"], async (req,res)=>{
  const {name,email,password}=req.body;
  const exists = await Member.findOne({email});
  if(exists) return res.status(400).send("Email exists");

  const hash = await bcrypt.hash(password,10);
  await Member.create({name,email,password:hash});

  res.send("Signup successful");
});

app.post(["/login", "/studio/auth/login"], async (req,res)=>{
  const {email,password}=req.body;
  const member = await Member.findOne({email});
  if(!member) return res.status(400).send("User not found");

  const ok = await bcrypt.compare(password,member.password);
  if(!ok) return res.status(400).send("Wrong password");

  res.json({name:member.name});
});

/* Events */
app.post(["/addEvent", "/studio/api/sessions"], async (req,res)=>{
  const data = req.body;
  data.totalSeats = data.totalSeats || 50;
  data.seatsLeft = data.totalSeats;

  await Session.create(data);
  res.send("Added");
});

app.get(["/events", "/studio/api/sessions"], async (req,res)=>{
  const data = await Session.find().sort({date:1});
  res.json(data);
});

app.put(["/update/:id", "/studio/api/sessions/:id"], async (req,res)=>{
  await Session.findByIdAndUpdate(req.params.id, req.body);
  res.send("Updated");
});

app.delete(["/delete/:id", "/studio/api/sessions/:id"], async (req,res)=>{
  await Session.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

/* Booking */
app.put(["/book/:id", "/studio/api/sessions/book/:id"], async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).send("Event not found");

    const today = new Date().toISOString().split("T")[0];

    if (session.date < today) {
      return res.status(400).send("Cannot book past events");
    }

    if (session.seatsLeft <= 0) {
      return res.status(400).send("No seats left");
    }

    session.seatsLeft -= 1;
    await session.save();

    res.send("Booking confirmed");

  } catch (err) {
    res.status(500).send("Booking error");
  }
});

/* Favorite */
app.put(["/favorite/:id", "/studio/api/sessions/favorite/:id"], async (req,res)=>{
  const session = await Session.findById(req.params.id);
  session.favorite = !session.favorite;
  await session.save();
  res.send("Favorite updated");
});

/* RSVP */
app.put(["/rsvp/:id", "/studio/api/sessions/rsvp/:id"], async (req,res)=>{
  await Session.findByIdAndUpdate(req.params.id,{
    rsvp:req.body.rsvp
  });
  res.send("RSVP updated");
});

/* Static */
app.use(express.static(path.join(__dirname, "public")));

app.listen(5000, ()=>{
  console.log("Server running on http://localhost:5000");
});