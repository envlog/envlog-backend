"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var session_1 = __importDefault(require("../Connections/session"));
var auth_1 = require("../Controllers/auth");
var path_1 = require("../Config/path");
var indexRouter = express_1.default.Router();
indexRouter.use(session_1.default);
indexRouter.get('', auth_1.requiresAuth, function (req, res) {
    return res.sendFile('index.html', { root: path_1.staticFolder });
});
exports.default = indexRouter;
