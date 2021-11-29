"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_config_1 = __importDefault(require("./Config/dotenv_config"));
(0, dotenv_config_1.default)();
var db_connection_1 = __importDefault(require("./Connections/db_connection"));
db_connection_1.default;
var startMqttClient_1 = require("./Connections/startMqttClient");
(0, startMqttClient_1.startMqttClient)();
var express_1 = __importDefault(require("express"));
var Login_1 = __importDefault(require("./Routes/Login"));
var Register_1 = __importDefault(require("./Routes/Register"));
var Logout_1 = __importDefault(require("./Routes/Logout"));
var Index_1 = __importDefault(require("./Routes/Index"));
var path_1 = require("./Config/path");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', Index_1.default);
app.use('/auth', Login_1.default);
app.use('/auth', Register_1.default);
app.use('/auth', Logout_1.default);
app.use(express_1.default.static(path_1.staticFolder));
app.listen(process.env.SERVER_PORT, function () { return console.log("[SERVER] Server online on port " + process.env.SERVER_PORT + "."); });
