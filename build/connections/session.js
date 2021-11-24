"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var express_session_1 = __importDefault(require("express-session"));
dotenv_1.default.config();
var session = (0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false
});
exports.default = session;
