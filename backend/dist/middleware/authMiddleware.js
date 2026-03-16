"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware = (req, res, next) => {
    // Add authentication logic here
    next();
};
exports.default = authMiddleware;
