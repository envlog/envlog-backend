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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMqttClient = void 0;
var mqtt_client_1 = __importDefault(require("./mqtt_client"));
var socket_1 = __importDefault(require("./socket"));
var save_to_buffer_1 = require("../Utils/save_to_buffer");
var sensors_loader_1 = require("../Utils/sensors_loader");
var misc_1 = require("../Utils/misc");
var startMqttClient = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        mqtt_client_1.default.on('message', function (_, payload) { return __awaiter(void 0, void 0, void 0, function () {
            var mqttObject, sensor, Type, socketObject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mqttObject = JSON.parse(payload.toString());
                        if (sensors_loader_1.sensorsCollection) {
                            sensor = sensors_loader_1.sensorsCollection.find(function (_a) {
                                var MCU_ID = _a.MCU_ID, Type = _a.Type;
                                return MCU_ID === mqttObject.MCU_ID && Type === mqttObject.Type;
                            });
                            if (!sensor || (sensor && !sensor.Enabled))
                                return [2 /*return*/]; // Controllo che il sensore sia attivo o che sia presente nella lista
                        }
                        return [4 /*yield*/, (0, save_to_buffer_1.saveToBuffer)(mqttObject)];
                    case 1:
                        _a.sent();
                        Type = mqttObject.Type;
                        socketObject = {
                            MCU_ID: mqttObject.MCU_ID,
                            Type: mqttObject.Type,
                            Unit: mqttObject.Unit
                        };
                        if (Type === 'Battery')
                            socketObject.Value = mqttObject.Level;
                        else if (Type === 'Temperature')
                            socketObject.Value = mqttObject.Value;
                        else if ((0, misc_1.isVibrationSensor)(Type))
                            socketObject.Value = mqttObject.Data;
                        else
                            return [2 /*return*/];
                        socket_1.default.emit('data', JSON.stringify(socketObject));
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.startMqttClient = startMqttClient;
