"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = calculateFine;
function calculateFine({ baseFine, watts, repeatedOffenseCount, }) {
    void watts;
    const escalationSteps = Math.floor(repeatedOffenseCount / 10);
    return baseFine + escalationSteps * 5;
}
