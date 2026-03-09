
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

console.log('🚀 Loading socket server...');

const supabase = require("./supabase");

console.log('✅ Supabase loaded, type:', typeof supabase);

const app = express();
app.use(cors());

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
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
