"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const appliances = [
    { id: 1, name: 'Induction', baseFine: 15, watts: 1800 },
    { id: 2, name: 'Light', baseFine: 5, watts: 60 },
    { id: 3, name: 'Fan', baseFine: 5, watts: 75 },
    { id: 4, name: 'Washing Machine', baseFine: 15, watts: 500 },
    { id: 5, name: 'Geyser', baseFine: 25, watts: 2000 },
    { id: 6, name: 'Cooler', baseFine: 25, watts: 250 },
];
let reports = [];
exports.store = {
    getAppliances: () => appliances,
    getReports: () => reports,
    findApplianceById: (id) => appliances.find((appliance) => appliance.id === id),
    createReport: (report) => {
        const next = {
            ...report,
            id: reports.length + 1,
            createdAt: new Date().toISOString(),
        };
        reports = [next, ...reports];
        return next;
    },
};
