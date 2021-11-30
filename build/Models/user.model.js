"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var UserSchema = new mongoose_1.default.Schema({
    Username: {
        type: String,
        unique: true,
        required: true
    },
    Email: {
        type: String,
        unique: true,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    IsAdmin: {
        type: Boolean,
        default: false
    }
});
var User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
