"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVibrationSensor = void 0;
var isVibrationSensor = function (type) {
    return type === "TimeDomainDataInfo" || type === "RMSSpeedStatus" || type === "AccPeakStatus" || type === "FreqData";
};
exports.isVibrationSensor = isVibrationSensor;
