"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresAuth = exports.requiresNoAuth = void 0;
var requiresNoAuth = function (req, res, next) {
    if (!req.session.username)
        return next();
    return res.status(400).json({ error: "Already logged in!" }); // TODO: Redirect a dashboard
};
exports.requiresNoAuth = requiresNoAuth;
var requiresAuth = function (req, res, next) {
    if (req.session.username)
        return next();
    return res.status(401).json({ error: "You need to be logged in!" }); // TODO: Redirect a login
};
exports.requiresAuth = requiresAuth;
