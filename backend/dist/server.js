"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const storage_1 = require("./config/storage");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
(0, storage_1.ensureUploadsDirectory)();
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin not allowed by CORS'));
    },
}));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(storage_1.uploadsDirectory));
app.use(authRoutes_1.default);
app.use(reportRoutes_1.default);
const PORT = process.env.PORT || 5000;
const bootstrap = async () => {
    try {
        await (0, db_1.connectDatabase)();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to connect database. Check your .env values and MongoDB server status.');
        process.exit(1);
    }
};
bootstrap();
