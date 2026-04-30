# Vercel Deployment Guide

## Prerequisites
- Node.js and npm installed
- MongoDB Atlas account
- Vercel account

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/KartikRaikar9/mongocs.git
   cd Event_Management_Final
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Update `MONGO_URI` with your MongoDB Atlas connection string

4. **Test locally**
   ```bash
   npm run dev
   ```

## Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Convert to Vercel serverless"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable `MONGO_URI` in Project Settings
   - Click "Deploy"

## API Endpoints

- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login
- `GET /api/events` - List all events
- `POST /api/events` - Create new event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event
- `PUT /api/events/book?id=[id]` - Book a seat
- `PUT /api/events/favorite?id=[id]` - Toggle favorite
- `PUT /api/events/rsvp?id=[id]` - Update RSVP status

## Notes

- This is a Vercel serverless deployment
- Static files are served from `/public`
- MongoDB connection is pooled per request for optimal performance
