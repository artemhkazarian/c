const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("new_post", (data) => {
        io.emit("update_posts", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(5000, () => {
    console.log("Server with WebSockets running on port 5000");
});
