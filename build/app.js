"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
var Index_1 = __importDefault(require("./Routes/Index"));
var mqtt_client_1 = __importDefault(require("./Connections/mqtt_client"));
var path_1 = require("./Config/path");
var sensor_model_1 = __importDefault(require("./Models/sensor.model"));
var sensors = {};
mqtt_client_1.default.on('message', function (topic, payload) { return __awaiter(void 0, void 0, void 0, function () {
    var object, DevAddr, minifiedObject, Type, Type_1, MCU_ID, dataProperties, stringifiedProperties, tempObject, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("[MQTT] Incoming " + topic + ".");
                object = JSON.parse(payload.toString());
                DevAddr = object.DevAddr, minifiedObject = __rest(object, ["DevAddr"]);
                Type = minifiedObject.Type;
                if (!minifiedObject.Data) {
                    Type_1 = minifiedObject.Type, MCU_ID = minifiedObject.MCU_ID, dataProperties = __rest(minifiedObject, ["Type", "MCU_ID"]);
                    stringifiedProperties = JSON.stringify(dataProperties);
                    tempObject = {
                        Type: Type_1,
                        MCU_ID: MCU_ID,
                        Data: stringifiedProperties
                    };
                    minifiedObject = tempObject;
                }
                else
                    minifiedObject.Data = JSON.stringify(minifiedObject.Data);
                if (!sensors[Type]) {
                    sensors[Type] = {
                        counter: 0,
                        buffer: []
                    };
                }
                ;
                sensors[Type].buffer.push(minifiedObject);
                sensors[Type].counter++;
                if (!(sensors[Type].counter === Number(process.env.ELEMENTS_PER_BUFFER))) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sensor_model_1.default.insertMany(sensors[Type].buffer)];
            case 2:
                _a.sent();
                sensors[Type].counter = 0;
                sensors[Type].buffer.splice(0);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 4];
            case 4:
                ;
                return [2 /*return*/];
        }
    });
}); });
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', Index_1.default);
app.use('/login', Login_1.default);
app.use('/register', Register_1.default);
app.use('/logout', Logout_1.default);
app.use(express_1.default.static(path_1.staticFolder));
app.listen(process.env.SERVER_PORT, function () { return console.log("[SERVER] Server online on port " + process.env.SERVER_PORT + "."); });
