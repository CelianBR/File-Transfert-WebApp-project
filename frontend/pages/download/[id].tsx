import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function downloadPage() {
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (router.isReady && id) {
      fetchFileInfo();
    }
  }, [router.isReady, id]);

  async function fetchFileInfo() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/file/info/${id}`
      );

      if (!response.ok) {
        setError("Fichier non trouvé ou expiré");
        return;
      }

      const data = await response.json();
      setFileName(data.originalName);
    } catch (error) {
      setError("Erreur lors de la récupération des infos");
    }
  }

  async function downloadHandle() {
    if (!id) {
      setError("Impossible de trouver le fichier");
      return;
    }

    try {
      setIsDownloaded(true);
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/file/download/${id}`;
    } catch (error) {
      setError("Erreur lors du téléchargement");
    }
  }

  return (
    <main className="relative z-10 p-8 min-h-80 flex gap-x-10">
      <div className="w-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl text-blue-600 font-semibold mb-15 text-center font-satoshi">
          TELECHARGEZ VOS FICHIERS
        </h1>
        {fileName && (
          <div>
            <p className="text-center mb-4">
              <strong className="text-blue-800">Nom du fichier :</strong>{" "}
              {fileName}
            </p>
            <button
              onClick={downloadHandle}
              disabled={!id || !fileName || isDownloaded}
              className="w-70 bg-blue-600  py-3 px-4 rounded-full hover:bg-gray-800 transition-colors text-white"
            >
              Télécharger le fichier
            </button>
          </div>
        )}

        <p>{error}</p>
      </div>
    </main>
  );
}
