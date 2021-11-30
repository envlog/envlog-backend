"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var SensorsSchema = new mongoose_1.default.Schema({
    MCU_ID: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        unique: true
    },
    Type: {
        type: String,
        required: true
    },
    Enabled: {
        type: Boolean,
        default: true
    }
});
var Sensor = mongoose_1.default.model('Sensor', SensorsSchema);
exports.default = Sensor;
