import mongoose from "mongoose";

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

export const Member = mongoose.models.Member || mongoose.model("Member", memberSchema, "users");
export const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema, "events");
