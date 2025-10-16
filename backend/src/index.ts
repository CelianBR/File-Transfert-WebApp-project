import cors from "cors";
import express from "express";
import uploadRouter from "./routes/upload";

// Je definie l'app express et son port 8080
const app = express();
const port = 8080;

// Configuration CORS pour permettre les requêtes du frontend Next.js
app.use(cors());

// Definition des middlewares
app.use(express.json());

// Routes API - toutes préfixées par /api pour clarte
app.use("/api/file", uploadRouter); // Route pour les fonctionnalités liées aux uploads

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
