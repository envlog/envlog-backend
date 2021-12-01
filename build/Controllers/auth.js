"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.comparePassword = exports.requiresAuth = exports.requiresNoAuth = void 0;
var requiresNoAuth = function (req, res, next) {
    if (!req.session.username)
        return next();
    return res.status(400).redirect('/');
};
exports.requiresNoAuth = requiresNoAuth;
var requiresAuth = function (req, res, next) {
    //if (req.session && req.session.username)
    return next();
    return res.status(401).redirect('/auth/login');
};
exports.requiresAuth = requiresAuth;
var comparePassword = function (_a, res, next) {
    var _b = _a.body, password = _b.password, passwordConfirmation = _b.passwordConfirmation;
    if (password != passwordConfirmation)
        res.locals.error = {
            msg: "Le password non corrispondono!",
            param: "passwordConfirmation",
            location: "body"
        };
    return next();
};
exports.comparePassword = comparePassword;
var isAdmin = function (req, res, next) {
    //if (req.session.isAdmin)
    return next();
    return res.status(401).json({ errors: ["Non hai i permessi necessari!"] });
};
exports.isAdmin = isAdmin;
