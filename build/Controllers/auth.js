"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.requiresAuth = exports.requiresNoAuth = void 0;
var requiresNoAuth = function (req, res, next) {
    if (!req.session.username)
        return next();
    return res.status(400).redirect('/');
};
exports.requiresNoAuth = requiresNoAuth;
var requiresAuth = function (req, res, next) {
    if (req.session && req.session.username)
        return next();
    return res.status(401).redirect('/auth/login');
};
exports.requiresAuth = requiresAuth;
var comparePassword = function (_a, res, next) {
    var _b = _a.body, password = _b.password, passwordConfirmation = _b.passwordConfirmation;
    if (password === passwordConfirmation)
        return next();
    return res.status(401).json({ message: "Passwords do not match!" });
};
exports.comparePassword = comparePassword;
