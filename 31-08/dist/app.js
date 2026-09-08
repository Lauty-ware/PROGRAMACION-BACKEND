"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const tareas_routes_1 = __importDefault(require("./routes/tareas.routes"));
const error_handler_1 = require("./middlewares/error-handler");
const not_found_1 = require("./middlewares/not-found");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configureMiddleware();
        this.configureRoutes();
        this.configureErrorHandling();
    }
    configureMiddleware() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    configureRoutes() {
        this.app.use('/api/tareas', tareas_routes_1.default);
        // Ruta de salud para verificar que el servidor está funcionando
        this.app.get('/health', (req, res) => {
            res.status(200).json({ status: 'OK', message: 'Servidor funcionando correctamente' });
        });
    }
    configureErrorHandling() {
        this.app.use(not_found_1.notFoundHandler);
        this.app.use(error_handler_1.errorHandler);
    }
    start(port) {
        this.app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    }
}
exports.App = App;
