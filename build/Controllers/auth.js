"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIsAdmin = exports.passwordsMatch = exports.requiresAuth = exports.requiresNoAuth = void 0;
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
var passwordsMatch = function (passwordConfirmation, _a) {
    var req = _a.req;
    if (passwordConfirmation != req.body.password)
        throw "Le password non corrispondono!";
    return true;
};
exports.passwordsMatch = passwordsMatch;
var userIsAdmin = function (req, res, next) {
    //if (req.session.isAdmin)
    return next();
    return res.status(401).json({ errors: ["Non hai i permessi necessari!"] });
};
exports.userIsAdmin = userIsAdmin;
