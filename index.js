
  const express = require("express");
  const http = require("http");
  const cors = require("cors");
  const { Server } = require("socket.io");
  const supabase = require("./supabase");

  const app = express();
  app.use(cors());

  // Health check endpoint for Render wake-up
  app.get("/health", (req, res) => {
    res.status(200).send("OK");
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

    socket.on("new-order", async (orderData) => {
      // Just broadcast the order notification - frontend already handled inventory reduction
      io.emit("order-notification", orderData);
      console.log("📦 Order broadcast to all clients:", orderData.orderNumber);
      
      // Also emit menu-item-update event to trigger stock alert updates
      if (orderData && Array.isArray(orderData.items)) {
        io.emit("menu-item-update", {
          type: "order-placed",
          items: orderData.items,
          timestamp: new Date().toISOString()
        });
        console.log("🔄 Menu update broadcast for stock alerts");
      }
    });

    // Real-time menu item update (when individual items added/removed from cart)
    socket.on("menu-item-update", (updateData) => {
      if (updateData && updateData.id && updateData.quantity !== undefined) {
        console.log(`📋 Menu item update received: ${updateData.id} quantity=${updateData.quantity}`);
        io.emit("menu-item-update", updateData); // broadcast to all clients
      }
    });

    // Real-time feedback notification
    socket.on("new-feedback", (feedbackData) => {
      console.log("📢 New feedback received, broadcasting to clients");
      io.emit("feedback-notification", feedbackData);
    });

    // Real-time order status update (when order status changes to pending, preparing, ready, or completed)
    socket.on("order-status-update", (statusData) => {
      if (statusData && statusData.orderId && statusData.status) {
        console.log(`🚨 Order status update: Order #${statusData.orderId} → ${statusData.status}`);
        io.emit("order-status-changed", statusData); // broadcast to all clients
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
  });
