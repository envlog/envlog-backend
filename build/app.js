"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_config_1 = __importDefault(require("./Config/dotenv_config"));
(0, dotenv_config_1.default)();
var db_connection_1 = __importDefault(require("./Connections/db_connection"));
db_connection_1.default;
var express_1 = __importDefault(require("express"));
var Login_1 = __importDefault(require("./Routes/Login"));
var Register_1 = __importDefault(require("./Routes/Register"));
var Logout_1 = __importDefault(require("./Routes/Logout"));
var mqtt_client_1 = __importDefault(require("./Connections/mqtt_client"));
// TODO: Prendere i dati dal broker MQTT e mandarli ai vari client con Socket.IO
mqtt_client_1.default.on('message', function (topic, payload) {
});
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/login', Login_1.default);
app.use('/register', Register_1.default);
app.use('/logout', Logout_1.default);
app.listen(process.env.SERVER_PORT, function () { return console.log("[SERVER] Server online on port " + process.env.SERVER_PORT + "."); });
