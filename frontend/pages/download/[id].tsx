import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function downloadPage() {
  // Définition des const utilisées (affichage des erreurs, nom du fichier, boolean de désactivation du bouton.)
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query; // On récupère l'id dans l'adresse

  // UseEffect va permettre de lancer du code après le changement de valeur de ses dépendances
  // [router.isReady, id] définit quand le useEffect doit être exécuté ou réexécuté
  useEffect(() => {
    if (router.isReady && id) {
      fetchFileInfo();
    }
  }, [router.isReady, id]);

  // Méthode qui va permettre de récupérer les informations du fichier avant de le télécharger.
  // elle fait référence à la route /file/info du backend
  async function fetchFileInfo() {
    try {
      // méthode fetch qui récupère la réponse de l'api
      // process.env.NEXT_PUBLIC_API_URL permet de centraliser
      // dans un fichier .env la racine de l'adresse pour la changer facilement en prod
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/file/info/${id}`
      );

      // contrat de validation de la réponse
      if (!response.ok) {
        setError("Fichier non trouvé ou expiré");
        return;
      }

      // File info ne permet de récupérer que le nom du fichier
      // Il est possible de rajouter des informations dans le back par exemple la taille du fichier
      const data = await response.json();
      setFileName(data.originalName);
    } catch (error) {
      setError("Erreur lors de la récupération des infos");
    }
  }

  // Gestion de l'action du bouton de téléchargement
  async function downloadHandle() {
    // si aucun id n'est défini.
    if (!id) {
      setError("Impossible de trouver le fichier");
      return;
    }

    // Sinon on met le bouton à cliquer pour éviter le spam.
    try {
      setIsDownloaded(true);
      // On lance le téléchargement
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/file/download/${id}`;
    } catch (error) {
      setError("Erreur lors du téléchargement");
    }
  }

  return (
    <main className="relative z-10 p-4 sm:p-8 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md flex flex-col justify-center items-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-blue-600 font-semibold mb-8 sm:mb-12 text-center font-satoshi">
          TÉLÉCHARGEZ VOS FICHIERS
        </h1>
        {fileName && (
          <div className="w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
            {/* Titre */}
            <p className="text-center mb-6 text-sm sm:text-base">
              <strong className="text-blue-800">Nom du fichier :</strong>{" "}
              <span className="break-all">{fileName}</span>
            </p>
            {/* Bouton de téléchargement qui n'est pas cliquable si aucun fichier ou id ou si le fichier est déjà téléchargé*/}
            <button
              onClick={downloadHandle}
              disabled={!id || !fileName || isDownloaded}
              className="w-full bg-blue-600 py-3 px-4 rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-white font-medium"
            >
              {isDownloaded
                ? "Téléchargement en cours..."
                : "Télécharger le fichier"}
            </button>
          </div>
        )}

        {error && (
          <div className="w-full max-w-md mt-4">
            <p className="text-red-500 text-center bg-red-50 p-4 rounded-lg border border-red-200">
              {error}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
