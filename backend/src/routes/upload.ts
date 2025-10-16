import { randomUUID } from "crypto";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

// Creation du router express pour les requetes de type get et post
const router = express.Router();

// Creation du chemin de telechargement
// Si le dossier uploads n'existe pas je vais le créer.
// grace a fs qui me permet d'interagir avec le systeme de ficher
const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Je def un stockage
const storage = multer.diskStorage({
  // des
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) =>
    cb(null, `${randomUUID()}-${file.originalname}`),
});

const upload = multer({ storage: storage });

// Je map le nom du fichier avec l'id attribué afin de les recuperer facilement
// je definie un type pour la valeur de ma map
type Meta = {
  filePath: string;
  originalName: string;
  timeoutId?: NodeJS.Timeout;
};
// je definis map map comme un couple cle valeur ou la valeur doit etre du type Meta
const files = new Map<string, Meta>();

// Creation de la route post de l'upload pour pouvoir recuperer les fichier envoyés
// la route /api/file/upload
router.post(
  "/upload",
  upload.single("file"), // Permet de recuperer les types file, .single fait reference au middleware multer pour la recuperation d'un fichier
  (req: express.Request, res: express.Response) => {
    // je recupere le fichier qui se trouve dans la requete
    const file = req.file;
    // Si le fichier n'existe pas alors je renvoie une erreur.
    if (!file) return res.status(400).json({ error: "Aucun fichier reçu" });

    // Je crée les differents const qui vont me permettre de sauvegarder le fichier
    const id = randomUUID(); // un uuid aleatoire de type V4
    const filePath = file.path; // le fichier etant traite par le middleware multer je peux recuperer le path du fichier
    const originalName = file.originalname; // le nom original du fichier

    // la const timeoutId fait reference a une methode setTimeout de node qui execute du code apres un certain temps soit une heure
    const timeoutId = setTimeout(() => {
      fs.unlink(filePath, () => {});
      files.delete(id); // apres le delais depassé je supprime les metadonnées de l'id
    }, 1 * 60 * 60 * 1000);

    // Dans la map que j'ai créé precedement je vais ajouter mon les indos du fichier avec comme clé l'id et en valeur les restes des infos
    files.set(id, { filePath, originalName, timeoutId });

    // Je retourne un lien de telechargement créé avec l'id
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
  // Je recupere l'id du fichier passé dans le lien
  const id: string = req.params.id!;
  // Les meta données a partir de l'id
  const meta = files.get(id);
  // Si l'id n'est pas dans ma map alors c'est que le fichier n'existe pas.
  if (!meta) return res.status(404).json({ error: "Lien invalide ou expiré" });

  // La reponse de cette requete get dois etre un telecharegment
  // filePath est le chemin du fichier sur le serveur que vous voulez envoyer.
  // et meta.originalName : Le nom sous lequel le fichier sera téléchargé par le client.
  // le cb err va permettre d'executer du code une fois le telechargement terminé
  res.download(meta.filePath, meta.originalName, (err) => {
    // suppression après envoi (si pas d'erreur)
    if (!err) {
      fs.unlink(meta.filePath, () => {});
      if (meta.timeoutId) clearTimeout(meta.timeoutId);
      files.delete(id);
    } else {
      // en cas d'erreur d'envoi, retourne une erreur (et conserve le fichier pour debug)
      console.error("Erreur download:", err);
      if (!res.headersSent)
        res.status(500).json({ error: "Erreur lors du téléchargement" });
    }
  });
});

export default router;
