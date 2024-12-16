"use strict";

const mongoose = require("mongoose");
const app = require("./app");
const http = require("http");
const socketServer = require("../src/infrastructure/sockets/socketServer");
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.NODE_ENV === "production" ? process.env.MONGODB_URI : 'mongodb://mongo:27017/sprintflow';

if (!MONGODB_URI) {
  console.error(
    "Error: MONGODB_URI is not defined in the environment variables."
  );
  process.exit(1);
}

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const server = http.createServer(app);

    socketServer(server);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    const gracefulShutdown = () => {
      console.log("Shutting down gracefully...");
      server.close(() => {
        console.log("HTTP server closed.");
        mongoose.connection.close(false, () => {
          console.log("MongoDB connection closed.");
          process.exit(0);
        });
      });
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
