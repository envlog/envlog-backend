"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validIfExists = exports.isBoolean = void 0;
var isBoolean = function (param) {
    if (param !== undefined && (param != "true" && param != "false"))
        throw "Il valore deve essere true o false!";
    return true;
};
exports.isBoolean = isBoolean;
var validIfExists = function (param) {
    if (param !== undefined && param === "")
        throw "Il valore non è valido!";
    return true;
};
exports.validIfExists = validIfExists;
