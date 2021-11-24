"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresAuth = exports.doesNotRequireAuth = void 0;
var doesNotRequireAuth = function (req, res, next) {
    if (!req.session.username)
        return next();
    return res.status(400).json({ error: "Already logged in!" });
};
exports.doesNotRequireAuth = doesNotRequireAuth;
var requiresAuth = function (req, res, next) {
    if (req.session.username)
        return next();
    return res.status(401).json({ error: "You need to be logged in!" });
};
exports.requiresAuth = requiresAuth;
