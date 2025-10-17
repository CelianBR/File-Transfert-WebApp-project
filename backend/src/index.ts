import cors from "cors";
import express from "express";
import uploadRouter from "./routes/upload";

// Je definie l'app express et son port 8080, les variables d'environnement sont definies en prod sur railway
const app = express();
const port = process.env.PORT || 8080;

// Configuration CORS plus flexible pour le déploiement
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_ORIGIN,
].filter(Boolean); // Retire les valeurs undefined

console.log("CORS allowed origins:", ALLOWED_ORIGINS);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request origin:", origin);

      // Permet les requêtes sans origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Vérifie si l'origin est dans la liste autorisée
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      console.error("CORS blocked origin:", origin);
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    },
    credentials: true, // Permet les cookies si nécessaire
  })
);

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
