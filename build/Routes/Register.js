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
var user_model_1 = __importDefault(require("../Models/user.model"));
var express_validator_1 = require("express-validator");
var bcrypt_1 = __importDefault(require("bcrypt"));
var session_1 = __importDefault(require("../Connections/session"));
var auth_1 = require("../Controllers/auth");
var path_1 = require("../Config/path");
var registerRouter = express_1.default.Router();
registerRouter.use(session_1.default);
registerRouter.get('/register', auth_1.requiresNoAuth, function (req, res) {
    return res.status(200).sendFile('register.html', { root: path_1.staticFolder });
});
registerRouter.post('/register', auth_1.requiresNoAuth, auth_1.comparePassword, (0, express_validator_1.body)('username').isLength({ min: Number(process.env.MIN_USERNAME_LEN) }).trim().escape().withMessage("Il nome utente deve contenere almeno " + process.env.MIN_USERNAME_LEN + " caratteri!"), (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage("L'email non è valida!"), (0, express_validator_1.body)('password').isLength({ min: Number(process.env.MIN_PASS_LEN) }).trim().escape().withMessage("La password deve contenere almeno " + process.env.MIN_PASS_LEN + " caratteri!"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, errorsArray, _a, username, email, password, user, hashPsw, newUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                errorsArray = errors.array();
                res.locals.error && errorsArray.push(res.locals.error);
                if (errorsArray.length)
                    return [2 /*return*/, res.status(400).json({ errors: errorsArray })];
                _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, user_model_1.default.findOne({ $or: [{ Email: email }, { Username: username }] })];
            case 2:
                user = _b.sent();
                if (user)
                    return [2 /*return*/, res.status(400).json({ errors: { msg: "Email o nome utente già esistenti!" } })]; //Controllo lato front-end se errors è un array
                return [4 /*yield*/, bcrypt_1.default.hash(password, Number(process.env.SALT_ROUNDS))];
            case 3:
                hashPsw = _b.sent();
                newUser = new user_model_1.default({ Username: username, Email: email, Password: hashPsw });
                return [4 /*yield*/, newUser.save()];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(201).json({ username: username, email: email })];
            case 5:
                error_1 = _b.sent();
                return [2 /*return*/, res.status(500).json({ errors: { msg: error_1 } })];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.default = registerRouter;
