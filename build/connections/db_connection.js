"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var db_init = function () {
    mongoose_1.default.connect("mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME, function (error) {
        if (error)
            console.log(error);
    });
    var db = mongoose_1.default.connection;
    db.once('open', function () { return console.log("[DATABASE] Connected to mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME + "."); });
};
exports.default = db_init();
