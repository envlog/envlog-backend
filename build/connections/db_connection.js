"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var db_init = function () {
    mongoose_1.default.connect('mongodb://localhost:27017/users');
    var db = mongoose_1.default.connection;
    db.on('error', function (err) { return console.log(err.message); });
    db.once('open', function () { return console.log("Connected to Database"); });
};
exports.default = db_init();
