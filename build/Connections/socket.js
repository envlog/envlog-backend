"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var io = new socket_io_1.Server(Number(process.env.SOCKET_PORT), {
    pingInterval: Number(process.env.PING_INTERVAL),
    pingTimeout: Number(process.env.PING_TIMEOUT)
});
io.on('connection', function (socket) {
    console.log("[SOCKET.IO] " + socket.id + " connected!");
});
exports.default = io;
