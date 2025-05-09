// const express = require("express");
// use instead
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";

import { connectDB } from "./lib/db.js";

import { clerkMiddleware } from "@clerk/express";

import fileUpload from "express-fileupload";
import path from "path";
import { createServer } from "http";
import initializeSocket from "./lib/socket.js";

import cron from "node-cron";
import fs from "fs";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

const httpServer = createServer(app);
initializeSocket(httpServer); //to send events from our server and listen to events

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json()); // to parse req.body

app.use(clerkMiddleware()); // this will add auth to req obj => req.auth.userId

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"), // to create tmp folder under backend when uploading images or files
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
  })
);

//get location of tmp folder
const tempDir = path.join(process.cwd(), "tmp");

// cron jobs
//delete every 1 hour
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.log("error", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {});
      }
    });
  }
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  //whenever the user visits any route other than /api/*

  //send index.htm file which will come in production under dist
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

// error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

httpServer.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  connectDB();
});

// TODO: socket.io
