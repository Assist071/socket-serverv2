
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const supabase = require("./supabase");

const app = express();
app.use(cors());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "✓ Socket.IO server is running", timestamp: new Date().toISOString() });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      // Allow localhost development and Render.com production
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost",
        "http://127.0.0.1",
        "https://socket-serverv2.onrender.com",
        "https://hub-food-flow.onrender.com"
      ];
      
      // Allow any .onrender.com domain
      if (origin && origin.includes('.onrender.com')) {
        return callback(null, true);
      }
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: false,
    allowEIO3: true
  },
  transports: ["polling", "websocket"],
  pingInterval: 25000,
  pingTimeout: 60000,
  maxHttpBufferSize: 1e6,
  allowUpgrades: true
});

// Example event: broadcast new order
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("new-order", async (orderData) => {
    io.emit("order-notification", orderData); // broadcast to all clients

    // Production: Update menu quantities in DB, then emit updated menu items
    if (orderData && Array.isArray(orderData.items)) {
      try {
        // Update each menu item's quantity in the database
        const updatedItems = [];
        for (const item of orderData.items) {
          // Fetch current menu item
          const { data: menuItem, error: fetchError } = await supabase
            .from('menu_items')
            .select('*')
            .eq('id', item.id)
            .single();
          if (fetchError || !menuItem) continue;

          // Calculate new quantity
          const newQuantity = (menuItem.quantity || 0) - (item.quantity || 1);
          // Update in DB
          const { data: updated, error: updateError } = await supabase
            .from('menu_items')
            .update({ quantity: newQuantity })
            .eq('id', item.id)
            .select()
            .single();
          if (!updateError && updated) {
            updatedItems.push(updated);
          }
        }
        if (updatedItems.length > 0) {
          io.emit("menu-update", updatedItems); // broadcast actual updated menu items
        }
      } catch (err) {
        console.error("Error updating menu items:", err);
      }
    }
  });

  // Real-time menu item update (when individual items added/removed from cart)
  socket.on("menu-item-update", (updateData) => {
    if (updateData && updateData.id && updateData.quantity !== undefined) {
      console.log(`📋 Menu item update received: ${updateData.id} quantity=${updateData.quantity}`);
      io.emit("menu-item-update", updateData); // broadcast to all clients
    }
  });

  // Real-time order status update (when order status changes to pending, preparing, ready)
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
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Supabase URL: ${process.env.SUPABASE_URL ? '✓ configured' : '✗ missing'}`);
  console.log(`📊 CORS Origins: socket-serverv2.onrender.com, localhost:3000, localhost:5173`);
  console.log(`⚡ Transports: polling (primary), websocket (fallback)`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
