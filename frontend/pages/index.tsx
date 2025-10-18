import { FormEvent, useState } from "react";

export default function HomePage() {
  // Définition de mes constantes
  // Pour l'affichage et les validations
  const [error, setError] = useState("");
  const [send, setSend] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || ""; // Adresse racine de l'api

  // Gestion du clic du bouton d'envoi
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // Par défaut FormEvent va recharger la page
    e.preventDefault();

    // Si aucun fichier n'est sélectionné
    if (!selectedFile) {
      alert("Choisis un fichier");
      return;
    }

    // Première vérification dans le front pour éviter l'envoi de fichier de plus de 50mo
    // on retrouve une vérification dans le backend
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("Votre fichier dépasse 50 Mb");
      setSend(false);
      return;
    }
    // Bloquer le bouton tout de suite
    // pour ne pas envoyer plusieurs fois la même chose
    setSend(true);

    // FormData permet de construire un objet qui attribue une clé à une valeur
    // il peut être envoyé via fetch.
    // la clé "file" est attribuée au fichier
    const fd = new FormData();
    fd.append("file", selectedFile);

    // On envoie le fichier via fetch
    try {
      const res = await fetch(`${apiBase}/api/file/upload`, {
        method: "POST",
        body: fd,
      });

      // on fait la gestion des résultats.
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();

      // On récupère le lien de téléchargement envoyé par le backend
      // on construit le lien en fonction de l'adresse du front
      const link = `${window.location.origin}/download/${data.downloadLink}`;
      setDownloadLink(link);

      // Copier directement le lien calculé
      navigator.clipboard?.writeText(link);
      alert("Lien copié");
    } catch (err) {
      console.error(err);
      setError("Erreur upload");
      setSend(false); // réautoriser l'envoi après erreur
    }
  }

  return (
    <main className=" relative z-10 p-8 min-h-80 flex flex-row gap-x-10 mt-16">
      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="max-h-80 space-y-4 bg-white border-black p-6 rounded-2xl shadow-2xl max-w-sm flex flex-col items-center justify-center"
      >
        <h2 className="text-xl font-md mb-2 text-center">
          Sélectionner vos fichiers
        </h2>
        <h3 className="text-mb font-light mb-5 text-center text-gray-600">
          maximum 50Mb
        </h3>

        {/* Input file caché */}
        {/* Le problème de l'input de type File est qu'il est difficile à styliser */}
        {/* D'après mes recherches une méthode classique consiste à le masquer puis styliser le label. Une fois le label cliqué il exécute l'input masqué. */}
        <input
          type="file"
          name="file"
          id="file-input"
          className="hidden"
          onChange={(e) => {
            setSelectedFile(e.target.files?.[0] || null);
            setSend(false);
          }}
        />

        {/* Zone de drop */}
        <label
          htmlFor="file-input" // Cette commande permet d'associer l'input au clic sur le label
          // Sinon création du style de la zone de drop
          className="block w-full p-6 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer text-center bg-blue-100/50"
        >
          <div className="flex flex-col items-center space-y-3">
            <div>
              <span className="text-gray-700 font-medium">
                {selectedFile
                  ? selectedFile.name
                  : "Cliquez pour choisir un fichier"}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                {selectedFile
                  ? `Taille: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : "Ou glissez-déposez votre fichier ici"}
              </p>
            </div>
          </div>
        </label>

        {!send ? ( // Si le bouton n'est pas envoyé on propose le bouton envoyer
          <button
            type="submit"
            className="w-70 bg-blue-700/90 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer "
            disabled={send}
            style={{ pointerEvents: "auto", position: "relative", zIndex: 20 }}
          >
            Envoyer
          </button>
        ) : (
          // Sinon c'est le bouton copier le lien qui est affiché.
          <div>
            <button
              onClick={() => {
                if (downloadLink) {
                  navigator.clipboard?.writeText(downloadLink);
                  alert("lien copié");
                }
              }}
              className="w-70 bg-black py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors text-white"
            >
              Copier le lien
            </button>
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}
      </form>

      <div className="w-screen flex flex-col">
        <h1 className="text-3xl text-blue-600 font-semibold mb-6 text-center font-satoshi">
          ENVOYER VOS FICHIERS
        </h1>

        <div className="p-10">
          <p className="text-center">
            Ce site web permet d'envoyer des petits fichiers uniques (ex photos,
            pdf, etc) de manière rapide et sécurisée.
          </p>
          <p className="text-center">
            Une fois le fichier téléversé. Envoyez le lien unique à la personne
            de votre choix. Cette personne pourra alors récupérer le fichier.
          </p>
        </div>
      </div>
    </main>
  );
}
