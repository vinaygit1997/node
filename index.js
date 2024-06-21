const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = 3003;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const bookings = [];

io.on("connection", socket => {
  console.log("a user connected");

  // Send "Good Morning" message and menu to the client on connection
  socket.emit("chat message", "Good Morning! Welcome to the Gas Cylinder Booking System. Enter 1 to book, 2 to cancel, 3 for menu.");

  socket.on("chat message", msg => {
    let response = "";
    switch (msg.trim()) {
      case '1':
        bookings.push(socket.id);
        response = "Your gas cylinder has been booked successfully.";
        break;
      case '2':
        const index = bookings.indexOf(socket.id);
        if (index > -1) {
          bookings.splice(index, 1);
          response = "Your booking has been canceled.";
        } else {
          response = "No booking found to cancel.";
        }
        break;
      case '3':
        response = "Menu: Enter 1 to book, 2 to cancel, 3 for menu.";
        break;
      default:
        response = "Invalid input. Enter 1 to book, 2 to cancel, 3 for menu.";
        break;
    }
    console.log("message:", msg, "response:", response);
    socket.emit("chat message", response);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    // Optionally, handle cleanup if a user disconnects without canceling a booking
    const index = bookings.indexOf(socket.id);
    if (index > -1) {
      bookings.splice(index, 1);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
