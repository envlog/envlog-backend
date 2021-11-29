"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var session_1 = __importDefault(require("../Connections/session"));
var auth_1 = require("../Controllers/auth");
var logoutRouter = express_1.default.Router();
logoutRouter.use(session_1.default);
logoutRouter.post('/', auth_1.requiresAuth, function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Couldn't destroy session!" });
        }
    });
    return res.status(200).redirect('/login');
});
exports.default = logoutRouter;