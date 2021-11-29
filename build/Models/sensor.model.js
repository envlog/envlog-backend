"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var SensorDataSchema = new mongoose_1.default.Schema({
    MCU_ID: {
        type: String,
        required: true
    },
    Data: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
    }
});
var time = 60 * 60 * 24 * 14; // 2 settimane
SensorDataSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });
var SensorData = mongoose_1.default.model('SensorsDataHistory', SensorDataSchema);
exports.default = SensorData;
