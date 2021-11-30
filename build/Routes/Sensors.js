"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_validator_1 = require("express-validator");
var session_1 = __importDefault(require("../Connections/session"));
var auth_1 = require("../Controllers/auth");
var sensors_model_1 = __importDefault(require("../Models/sensors.model"));
var sensors_loader_1 = require("../Utils/sensors_loader");
var sensorsRouter = express_1.default.Router();
sensorsRouter.use(session_1.default);
sensorsRouter.get('/', auth_1.requiresAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sensors, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, sensors_model_1.default.find()];
            case 1:
                sensors = _a.sent();
                return [2 /*return*/, res.status(200).json(sensors)];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, res.status(500).json({ errors: error_1 })];
            case 3: return [2 /*return*/];
        }
    });
}); });
sensorsRouter.get('/:id/:type', auth_1.requiresAuth, (0, express_validator_1.param)('id').exists().withMessage('ID non trovato!'), (0, express_validator_1.param)('type').exists().withMessage('Tipo non trovato!'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, id, type, sensor, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.params, id = _a.id, type = _a.type;
                return [4 /*yield*/, sensors_model_1.default.findOne({ $and: [{ MCU_ID: id }, { Type: type }] })];
            case 2:
                sensor = _b.sent();
                if (sensor)
                    return [2 /*return*/, res.status(200).json(sensor)];
                return [2 /*return*/, res.status(404).json({ errors: { msg: "Sensore non trovato!" } })];
            case 3:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(500).json({ errors: error_2 })];
            case 4: return [2 /*return*/];
        }
    });
}); });
sensorsRouter.post('/', auth_1.requiresAuth, auth_1.isAdmin, (0, express_validator_1.body)('id').exists().withMessage('ID non trovato!'), (0, express_validator_1.body)('name').exists().withMessage('Nome non trovato!'), (0, express_validator_1.body)('type').exists().withMessage('Tipo non trovato!'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, id, name_1, type, enabled, sensor, newSensor, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                _a = req.body, id = _a.id, name_1 = _a.name, type = _a.type, enabled = _a.enabled;
                return [4 /*yield*/, sensors_model_1.default.findOne({ $or: [{ Name: name_1 }, { $and: [{ MCU_ID: id }, { Type: type }] }] })];
            case 2:
                sensor = _b.sent();
                if (sensor)
                    return [2 /*return*/, res.status(409).json({ errors: { msg: "Esiste già un sensore con questo nome o con la combinazione ID/Tipo!" } })];
                newSensor = new sensors_model_1.default({ MCU_ID: id, Name: name_1, Type: type, Enabled: (enabled != undefined ? enabled : true) });
                return [4 /*yield*/, newSensor.save()];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, sensors_loader_1.loadSensorsCollection)()];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(201).json({ msg: "Sensore aggiunto!", sensor: newSensor })];
            case 5:
                error_3 = _b.sent();
                return [2 /*return*/, res.status(500).json({ errors: error_3 })];
            case 6: return [2 /*return*/];
        }
    });
}); });
sensorsRouter.put('/:id/:type', auth_1.requiresAuth, auth_1.isAdmin, (0, express_validator_1.param)('id').exists().withMessage('ID non trovato!'), (0, express_validator_1.param)('type').exists().withMessage('Tipo non trovato!'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, type, _b, name_2, enabled, sensor, sensorWithName, error_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                _a = req.params, id = _a.id, type = _a.type;
                _b = req.body, name_2 = _b.name, enabled = _b.enabled;
                return [4 /*yield*/, sensors_model_1.default.findOne({ $and: [{ MCU_ID: id }, { Type: type }] })];
            case 1:
                sensor = _c.sent();
                if (!sensor)
                    return [2 /*return*/, res.status(404).json({ errors: { msg: "Sensore non trovato!" } })];
                return [4 /*yield*/, sensors_model_1.default.findOne({ Name: name_2 })];
            case 2:
                sensorWithName = _c.sent();
                if (sensorWithName)
                    return [2 /*return*/, res.status(400).json({ errors: { msg: "Esiste già un sensore con questo nome!" } })];
                return [4 /*yield*/, sensors_model_1.default.updateOne(sensor, {
                        Name: name_2 ? name_2 : sensor.Name,
                        Enabled: enabled != undefined ? enabled : sensor.Enabled
                    })];
            case 3:
                _c.sent();
                return [4 /*yield*/, sensor.save()];
            case 4:
                _c.sent();
                return [4 /*yield*/, (0, sensors_loader_1.loadSensorsCollection)()];
            case 5:
                _c.sent();
                return [2 /*return*/, res.status(200).json({ msg: "Dati sensore aggiornati con successo!", name: name_2, enabled: enabled })];
            case 6:
                error_4 = _c.sent();
                return [2 /*return*/, res.status(500).json({ errors: error_4 })];
            case 7: return [2 /*return*/];
        }
    });
}); });
sensorsRouter.delete('/:id/:type', auth_1.requiresAuth, auth_1.isAdmin, (0, express_validator_1.param)('id').exists().withMessage('ID non trovato!'), (0, express_validator_1.param)('type').exists().withMessage('Tipo non trovato!'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, id, type, sensor, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                _a = req.params, id = _a.id, type = _a.type;
                return [4 /*yield*/, sensors_model_1.default.findOne({ $and: [{ MCU_ID: id }, { Type: type }] })];
            case 2:
                sensor = _b.sent();
                if (!sensor)
                    return [2 /*return*/, res.status(404).json({ errors: { msg: "Sensore non trovato!" } })];
                return [4 /*yield*/, sensors_model_1.default.deleteOne(sensor)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, sensors_loader_1.loadSensorsCollection)()];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ msg: "Sensore cancellato", sensor: sensor })];
            case 5:
                error_5 = _b.sent();
                return [2 /*return*/, res.status(500).json({ errors: error_5 })];
            case 6: return [2 /*return*/];
        }
    });
}); });
sensorsRouter.delete('/:id', auth_1.requiresAuth, auth_1.isAdmin, (0, express_validator_1.param)('id').exists().withMessage('ID non trovato!'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, id, sensors, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                id = req.params.id;
                return [4 /*yield*/, sensors_model_1.default.find({ MCU_ID: id })];
            case 2:
                sensors = _a.sent();
                if (!sensors)
                    return [2 /*return*/, res.status(404).json({ errors: { msg: "ID sensore non trovato!" } })];
                return [4 /*yield*/, sensors_model_1.default.deleteMany({ MCU_ID: id })];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, sensors_loader_1.loadSensorsCollection)()];
            case 4:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ msg: "Sensori cancellati!", sensors: sensors })];
            case 5:
                error_6 = _a.sent();
                return [2 /*return*/, res.status(500).json({ errors: error_6 })];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.default = sensorsRouter;
