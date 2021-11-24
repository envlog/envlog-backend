"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var Login_1 = __importDefault(require("./Routes/Login"));
var Register_1 = __importDefault(require("./Routes/Register"));
var mqtt_client_1 = __importDefault(require("./connections/mqtt_client"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/login', Login_1.default);
app.use('/register', Register_1.default);
mqtt_client_1.default.on('message', function (topic, payload) {
    console.log("" + topic);
    var object = JSON.parse(payload);
    console.log(object);
});
//db_connection;
app.listen(3001, function () { return console.log("Server Online"); });
