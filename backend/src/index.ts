import cors from "cors";
import express from "express";
import uploadRouter from "./routes/upload";

// Je définis l'app express et son port 8080, les variables d'environnement sont définies en prod sur railway
const app = express();
const port = process.env.PORT || 8080;

// Configuration CORS pour le déploiement ou le dev
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_ORIGIN,
].filter(Boolean); // Retire les valeurs undefined (si ma v.e FRONTEND_ORIGIN n'est pas définie)

app.use(
  cors({
    origin: (origin, callback) => {
      // Permet les requêtes sans origin (curl pour tester les routes)
      if (!origin) return callback(null, true);

      // Vérifie si l'origine est dans la liste autorisée
      // quand le serveur est en prod il n'accepte que le serveur front
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      console.error("CORS blocked origin:", origin);
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    },
    credentials: true, // Permet les cookies
  })
);

// Définition des middlewares
app.use(express.json());

// Routes API
app.use("/api/file", uploadRouter); // Route pour les fonctionnalités liées aux uploads et download

app.get("/", (req, res) => {
  res.redirect("/api/health");
});
// Route de santé pour vérifier que l'API fonctionne
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend API is running" });
});

// Lancement du serveur node sur le port défini précédemment
app.listen(port, () => {
  console.log(`API serveur en ligne sur le port ${port}`);
});
