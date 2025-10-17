import { FormEvent, useState } from "react";

export default function HomePage() {
  const [error, setError] = useState("");
  const [send, setSend] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedFile) {
      alert("Choisis un fichier");
      return;
    }

    // Premiere verification dans le front pour eviter l'envoi de fichier de plus de 50mo
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("Votre fichier dépasse 50 Mb");
      setSend(false);
      return;
    }
    // Bloquer le bouton tout de suite
    setSend(true);

    const fd = new FormData();
    fd.append("file", selectedFile);

    try {
      const res = await fetch(`${apiBase}/api/file/upload`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();

      const link = `${window.location.origin}/download/${data.downloadLink}`;
      setDownloadLink(link);

      // Copier directement le lien calculé (ne pas dépendre de downloadLink state)
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
          htmlFor="file-input"
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

        {!send ? (
          <button
            type="submit"
            className="w-70 bg-blue-700/90 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer "
            disabled={send}
            style={{ pointerEvents: "auto", position: "relative", zIndex: 20 }}
          >
            Envoyer
          </button>
        ) : (
          <div>
            <button
              onClick={() => {
                if (downloadLink) {
                  navigator.clipboard?.writeText(downloadLink);
                  alert("lien copie");
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
            Ce site web permet d'envoyer des petits fichiers unique (ex photos,
            pdf, etc) de maniere rapide et sécurisée.
          </p>
          <p className="text-center">
            une fois le fichier téléversé. Envoyer le lien unique à la personne
            de votre choix. cette personne pourra alors récupérer le fichier.
          </p>
        </div>
      </div>
    </main>
  );
}
