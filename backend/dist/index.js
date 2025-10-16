"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("./routes/upload"));
// Je definie l'app express et son port 8080
const app = (0, express_1.default)();
const port = 8080;
// Configuration CORS pour permettre les requêtes du frontend Next.js
app.use((0, cors_1.default)());
// Definition des middlewares
app.use(express_1.default.json());
// Routes API - toutes préfixées par /api pour clarte
app.use("/api/file", upload_1.default); // Route pour les fonctionnalités liées aux uploads
app.get("/", (req, res) => {
    res.redirect("/api/health");
});
// Route de santé pour vérifier que l'API fonctionne
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Backend API is running" });
});
// Lancemenet du serveur node sur le port def precedement
app.listen(port, () => {
    console.log(`API serveur en ligne sur le port ${port}`);
});
//# sourceMappingURL=index.js.map