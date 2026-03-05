const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

// import Supabase client for later use (ensure env vars are set)
const supabase = require('./supabase');
console.log('supabase client methods:', {
  from: typeof supabase.from,
  select: typeof supabase.from?.('anything')?.select
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Example event: broadcast new order
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("new-order", (orderData) => {
    io.emit("order-notification", orderData); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
