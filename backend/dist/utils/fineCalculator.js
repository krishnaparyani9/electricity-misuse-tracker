"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = calculateFine;
function calculateFine({ baseFine, watts, repeatedOffenseCount, }) {
    const powerPenalty = Math.ceil(watts / 250) * 5;
    const repeatPenalty = repeatedOffenseCount * 15;
    return baseFine + powerPenalty + repeatPenalty;
}
