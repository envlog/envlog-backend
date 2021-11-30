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
    Received: {
        type: Date,
        required: true
    }
});
SensorDataSchema.index({ Received: 1 }, { expireAfterSeconds: Number(process.env.EXPIRE_AFTER_SECONDS) });
var SensorData = mongoose_1.default.model('SensorsDataHistory', SensorDataSchema);
exports.default = SensorData;
