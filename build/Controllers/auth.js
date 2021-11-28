"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresAuth = exports.requiresNoAuth = void 0;
var requiresNoAuth = function (req, res, next) {
    if (!req.session.username)
        return next();
    return res.status(400).redirect('/');
};
exports.requiresNoAuth = requiresNoAuth;
var requiresAuth = function (req, res, next) {
    if (req.session && req.session.username)
        return next();
    return res.status(401).redirect('/login');
};
exports.requiresAuth = requiresAuth;
