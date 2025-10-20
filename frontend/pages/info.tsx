export default function InfoPage() {
  return (
    <main className="relative z-10 p-4 sm:p-8 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-blue-600 font-semibold mb-8 text-center font-satoshi">
          DÉMONSTRATION
        </h1>

        <div className="w-full flex justify-center">
          <video
            src="./Demo.mp4"
            controls
            className="w-full max-w-3xl h-auto rounded-lg shadow-lg"
            style={{ maxHeight: "70vh" }}
          />
        </div>

        <div className="mt-8 p-4 sm:p-6 bg-blue-50 rounded-lg">
          <p className="text-center text-sm sm:text-base text-gray-700">
            Regardez cette démonstration pour comprendre comment utiliser notre
            service de transfert de fichiers.
          </p>
        </div>
      </div>
    </main>
  );
}
