import { randomUUID } from "crypto";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

// Création du router express pour les requêtes de type get et post
const router = express.Router();

// Création du chemin de téléchargement
// Si le dossier uploads n'existe pas je vais le créer.
// grâce à fs qui me permet d'interagir avec le système de fichiers
const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Je définis un stockage
const storage = multer.diskStorage({
  // filename va définir le nom des fichiers enregistrés avec l'uuid attribué et le nom
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) =>
    cb(null, `${randomUUID()}-${file.originalname}`),
});

// Je définis une taille max des fichiers
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// Nettoyage des fichiers orphelins au démarrage
// Si je redémarre le serveur la map qui possède les infos des fichiers est vidée et donc impossible de récupérer les fichiers
function cleanupOrphanedFiles() {
  try {
    const files = fs.readdirSync(uploadDir);
    console.log(`Nettoyage de ${files.length} fichiers orphelins`);

    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      fs.unlinkSync(filePath);
      console.log(`Fichier supprimé: ${file}`);
    });

    console.log("Fin du processus de nettoyage");
  } catch (error) {
    console.error("Erreur lors du nettoyage:", error);
  }
}

cleanupOrphanedFiles();

// Je map le nom du fichier avec l'id attribué afin de les récupérer facilement
// je définis un type pour la valeur de ma map
type Meta = {
  filePath: string;
  originalName: string;
  timeoutId?: NodeJS.Timeout;
};
// je définis ma map comme un couple clé valeur où la valeur doit être du type Meta
const files = new Map<string, Meta>();

// Création de la route post de l'upload pour pouvoir récupérer les fichiers envoyés
// la route /api/file/upload
router.post(
  "/upload",
  upload.single("file"), // Permet de récupérer les types file, .single fait référence au middleware multer pour la récupération d'un fichier
  (req: express.Request, res: express.Response) => {
    // je récupère le fichier qui se trouve dans la requête
    const file = req.file;

    // Si le fichier n'existe pas alors je renvoie une erreur.
    if (!file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }

    // si la taille du fichier est trop grande alors je retourne une erreur
    if (file.size > 50 * 1024 * 1024) {
      return res
        .status(400)
        .json({ error: "Fichier trop volumineux (max 50MB)" });
    }

    // Je crée les différentes const qui vont me permettre de sauvegarder le fichier
    const id = randomUUID(); // un uuid aléatoire de type V4
    const filePath = file.path; // le fichier étant traité par le middleware multer je peux récupérer le path du fichier
    const originalName = file.originalname; // le nom original du fichier

    // la const timeoutId fait référence à une méthode setTimeout de node qui exécute du code après un certain temps soit une heure
    const timeoutId = setTimeout(() => {
      fs.unlink(filePath, () => {});
      files.delete(id); // après le délai dépassé je supprime les métadonnées et le fichier
    }, 0.5 * 60 * 60 * 1000); // 30min

    // Dans la map que j'ai créée précédemment je vais ajouter les infos du fichier avec comme clé l'id et en valeur le reste des infos
    files.set(id, { filePath, originalName, timeoutId });

    // Je retourne un lien de téléchargement créé avec l'id
    return res.json({ id, downloadLink: `${id}` });
  }
);

// GET /info/:id : récupère les infos du fichier sans le télécharger
router.get("/info/:id", (req: express.Request, res: express.Response) => {
  const id: string = req.params.id!;
  const meta = files.get(id);

  if (!meta) {
    return res.status(404).json({ error: "Fichier non trouvé ou expiré" });
  }

  // Renvoie les infos du fichier sans le télécharger
  return res.json({
    originalName: meta.originalName,
    exists: true,
    id: id,
  });
});

// GET /download/:id : envoie le fichier puis le supprime
router.get("/download/:id", (req: express.Request, res: express.Response) => {
  // Je récupère l'id du fichier passé dans le lien
  const id: string = req.params.id!;
  // Les métadonnées à partir de l'id
  const meta = files.get(id);
  // Si l'id n'est pas dans ma map alors c'est que le fichier n'existe pas.
  if (!meta) return res.status(404).json({ error: "Lien invalide ou expiré" });

  // et meta.originalName : Le nom sous lequel le fichier sera téléchargé par le client.
  // le cb err va permettre d'exécuter du code une fois le téléchargement terminé
  res.download(meta.filePath, meta.originalName, (err) => {
    // suppression après envoi (si pas d'erreur)
    if (!err) {
      fs.unlink(meta.filePath, () => {});
      if (meta.timeoutId) clearTimeout(meta.timeoutId);
      files.delete(id);
    } else {
      // en cas d'erreur d'envoi, retourne une erreur (et conserve le fichier pour debug)
      if (!res.headersSent)
        res.status(500).json({ error: "Erreur lors du téléchargement" });
    }
  });
});

export default router;
