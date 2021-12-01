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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var isBoolean_1 = require("../Utils/isBoolean");
var sensors_loader_1 = require("../Utils/sensors_loader");
var sensorsRouter = express_1.default.Router();
sensorsRouter.use(session_1.default);
sensorsRouter.get('/', auth_1.requiresAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var filters, sensors, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                filters = __rest(req.query, []);
                if (filters['Enabled'] && !(0, isBoolean_1.isBoolean)(filters['Enabled']))
                    return [2 /*return*/, res.status(400).json({ errors: ["Enabled deve essere un valore booleano!"] })];
                return [4 /*yield*/, sensors_model_1.default.find({ $and: [filters] })];
            case 1:
                sensors = _a.sent();
                return [2 /*return*/, res.status(200).json(sensors)];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, res.status(500).json({ errors: [error_1] })];
            case 3: return [2 /*return*/];
        }
    });
}); });
sensorsRouter.get('/:MCU_ID/:Type', auth_1.requiresAuth, (0, express_validator_1.param)('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non trovato!'), (0, express_validator_1.param)('Type').exists().isLength({ min: 1 }).withMessage('Tipo non trovato!'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, MCU_ID, Type, sensor, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array().map(function (item) { return item.msg; }) })];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.params, MCU_ID = _a.MCU_ID, Type = _a.Type;
                return [4 /*yield*/, sensors_model_1.default.findOne({ $and: [{ MCU_ID: MCU_ID }, { Type: Type }] })];
            case 2:
                sensor = _b.sent();
                if (sensor)
                    return [2 /*return*/, res.status(200).json(sensor)];
                return [2 /*return*/, res.status(404).json({ errors: ["Sensore non trovato!"] })];
            case 3:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(500).json({ errors: [error_2] })];
            case 4: return [2 /*return*/];
        }
    });
}); });
sensorsRouter.post('/', auth_1.requiresAuth, auth_1.isAdmin, (0, express_validator_1.body)('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non trovato!'), (0, express_validator_1.body)('Name').exists().isLength({ min: 1 }).withMessage('Nome non trovato!'), (0, express_validator_1.body)('Type').exists().isLength({ min: 1 }).withMessage('Tipo non trovato!'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, MCU_ID, Name, Type, Enabled, sensor, newSensor, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array().map(function (item) { return item.msg; }) })];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                _a = req.body, MCU_ID = _a.MCU_ID, Name = _a.Name, Type = _a.Type, Enabled = _a.Enabled;
                if (Enabled && !(0, isBoolean_1.isBoolean)(Enabled))
                    return [2 /*return*/, res.status(400).json({ errors: ["Enabled deve essere un valore booleano!"] })];
                return [4 /*yield*/, sensors_model_1.default.findOne({ $or: [{ Name: Name }, { $and: [{ MCU_ID: MCU_ID }, { Type: Type }] }] })];
            case 2:
                sensor = _b.sent();
                if (sensor)
                    return [2 /*return*/, res.status(409).json({ errors: ["Esiste già un sensore con questo nome o con la combinazione ID/Tipo!"] })];
                newSensor = new sensors_model_1.default({ MCU_ID: MCU_ID, Name: Name, Type: Type, Enabled: (Enabled ? Enabled : true) });
                return [4 /*yield*/, newSensor.save()];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, sensors_loader_1.loadSensorsCollection)()];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(201).json({ msg: "Sensore aggiunto!", sensor: newSensor })];
            case 5:
                error_3 = _b.sent();
                return [2 /*return*/, res.status(500).json({ errors: [error_3] })];
            case 6: return [2 /*return*/];
        }
    });
}); });
sensorsRouter.put('/:MCU_ID/', auth_1.requiresAuth, auth_1.isAdmin, (0, express_validator_1.param)('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non trovato!'), (0, express_validator_1.body)('Enabled').exists().isBoolean().withMessage("Enabled non valido!"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, MCU_ID, Enabled, sensor, modifiedCount, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array().map(function (item) { return item.msg; }) })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                MCU_ID = req.params.MCU_ID;
                Enabled = req.body.Enabled;
                return [4 /*yield*/, sensors_model_1.default.findOne({ MCU_ID: MCU_ID })];
            case 2:
                sensor = _a.sent();
                if (!sensor)
                    return [2 /*return*/, res.status(404).json({ errors: ["Nessun sensore trovato con questo ID!"] })];
                return [4 /*yield*/, sensors_model_1.default.updateMany({ MCU_ID: MCU_ID }, { Enabled: Enabled })];
            case 3:
                modifiedCount = (_a.sent()).modifiedCount;
                return [4 /*yield*/, (0, sensors_loader_1.loadSensorsCollection)()];
            case 4:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ msg: modifiedCount + " sensori aggiornati con successo!" })];
            case 5:
                error_4 = _a.sent();
                return [2 /*return*/, res.status(500).json({ errors: [error_4] })];
            case 6: return [2 /*return*/];
        }
    });
}); });
sensorsRouter.put('/:MCU_ID/:Type', auth_1.requiresAuth, auth_1.isAdmin, (0, express_validator_1.param)('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non trovato!'), (0, express_validator_1.param)('Type').exists().isLength({ min: 1 }).withMessage("Tipo non trovato!"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, MCU_ID, Type, _b, Name, Enabled, sensor, sensorWithName, error_5;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array().map(function (item) { return item.msg; }) })];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 8]);
                _a = req.params, MCU_ID = _a.MCU_ID, Type = _a.Type;
                _b = req.body, Name = _b.Name, Enabled = _b.Enabled;
                if (Enabled && !(0, isBoolean_1.isBoolean)(Enabled))
                    return [2 /*return*/, res.status(400).json({ errors: ["Enabled deve essere un valore booleano!"] })];
                if (Name && !Name.length)
                    return [2 /*return*/, res.status(400).json({ errors: ["Nome non valido!"] })];
                return [4 /*yield*/, sensors_model_1.default.findOne({ $and: [{ MCU_ID: MCU_ID }, { Type: Type }] })];
            case 2:
                sensor = _c.sent();
                if (!sensor)
                    return [2 /*return*/, res.status(404).json({ errors: ["Sensore non trovato!"] })];
                return [4 /*yield*/, sensors_model_1.default.findOne({ Name: Name })];
            case 3:
                sensorWithName = _c.sent();
                if (sensorWithName)
                    return [2 /*return*/, res.status(400).json({ errors: ["Esiste già un sensore con questo nome!"] })];
                return [4 /*yield*/, sensors_model_1.default.updateOne(sensor, {
                        Name: Name ? Name : sensor.Name,
                        Enabled: Enabled ? Enabled : sensor.Enabled
                    })];
            case 4:
                _c.sent();
                return [4 /*yield*/, sensor.save()];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, sensors_loader_1.loadSensorsCollection)()];
            case 6:
                _c.sent();
                return [2 /*return*/, res.status(200).json({ msg: "Dati sensore aggiornati con successo!", Name: Name, Enabled: Enabled })];
            case 7:
                error_5 = _c.sent();
                return [2 /*return*/, res.status(500).json({ errors: [error_5] })];
            case 8: return [2 /*return*/];
        }
    });
}); });
sensorsRouter.delete('/:MCU_ID/:Type', auth_1.requiresAuth, auth_1.isAdmin, (0, express_validator_1.param)('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non trovato!'), (0, express_validator_1.param)('Type').exists().isLength({ min: 1 }).withMessage('Tipo non trovato!'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, MCU_ID, Type, sensor, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array().map(function (item) { return item.msg; }) })];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                _a = req.params, MCU_ID = _a.MCU_ID, Type = _a.Type;
                return [4 /*yield*/, sensors_model_1.default.findOne({ $and: [{ MCU_ID: MCU_ID }, { Type: Type }] })];
            case 2:
                sensor = _b.sent();
                if (!sensor)
                    return [2 /*return*/, res.status(404).json({ errors: ["Sensore non trovato!"] })];
                return [4 /*yield*/, sensors_model_1.default.deleteOne(sensor)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, sensors_loader_1.loadSensorsCollection)()];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ msg: "Sensore cancellato", sensor: sensor })];
            case 5:
                error_6 = _b.sent();
                return [2 /*return*/, res.status(500).json({ errors: [error_6] })];
            case 6: return [2 /*return*/];
        }
    });
}); });
sensorsRouter.delete('/:MCU_ID', auth_1.requiresAuth, auth_1.isAdmin, (0, express_validator_1.param)('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non trovato!'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, MCU_ID, sensors, deletedCount, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array().map(function (item) { return item.msg; }) })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                MCU_ID = req.params.MCU_ID;
                return [4 /*yield*/, sensors_model_1.default.find({ MCU_ID: MCU_ID })];
            case 2:
                sensors = _a.sent();
                if (!sensors.length)
                    return [2 /*return*/, res.status(404).json({ errors: ["ID sensore non trovato!"] })];
                return [4 /*yield*/, sensors_model_1.default.deleteMany({ MCU_ID: MCU_ID })];
            case 3:
                deletedCount = (_a.sent()).deletedCount;
                return [4 /*yield*/, (0, sensors_loader_1.loadSensorsCollection)()];
            case 4:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ msg: deletedCount + " sensori cancellati!", sensors: sensors })];
            case 5:
                error_7 = _a.sent();
                return [2 /*return*/, res.status(500).json({ errors: [error_7] })];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.default = sensorsRouter;
