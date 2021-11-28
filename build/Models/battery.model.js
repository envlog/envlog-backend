"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var BatterySchema = new mongoose_1.default.Schema({
    MCU_ID: {
        type: String,
        required: true
    },
    Level: {
        type: String,
        required: true
    },
    Voltage: {
        type: Number,
        required: true
    },
    Unit: {
        type: String,
        require: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});
var BatteryData = mongoose_1.default.model('BatteryHistory', BatterySchema);
exports.default = BatteryData;
