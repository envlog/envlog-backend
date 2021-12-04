"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var dbInit = function () {
    mongoose_1.default.connect("mongodb://".concat(process.env.DB_HOST, ":").concat(process.env.DB_PORT, "/").concat(process.env.DB_NAME), function (error) {
        if (error)
            console.log(error);
    });
    var db = mongoose_1.default.connection;
    db.once('open', function () { return console.log("[DATABASE] Connected to mongodb://".concat(process.env.DB_HOST, ":").concat(process.env.DB_PORT, "/").concat(process.env.DB_NAME, ".")); });
};
exports.default = dbInit;
