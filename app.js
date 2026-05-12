// Importing required modules
const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

// Create an Express application
const app = express();

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.io on the created server for real-time communication
const io = socketio(server);

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

function getSessionId(value) {
    if (typeof value !== "string") {
        return "default";
    }
    const trimmed = value.trim().toLowerCase();
    return trimmed.replace(/[^a-z0-9-_]/g, "").slice(0, 40) || "default";
}

// Socket.io connection handler
io.on("connection", function (socket) {
    const sessionId = getSessionId(socket.handshake.query.sessionId);
    socket.join(sessionId);
    socket.emit("session-joined", { sessionId });

    socket.on("send-location", function (data) {
        io.to(sessionId).emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", function () {
        io.to(sessionId).emit("user-disconnected", socket.id);
    });
});

// Render the index.ejs view on root request
app.get("/", function (req, res) {
    res.render("index");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});