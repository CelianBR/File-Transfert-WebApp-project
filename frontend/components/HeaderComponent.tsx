import Link from "next/link";

export default function HeaderComponent() {
  return (
    <header className="w-screen flex justify-center mt-2 font-bold">
      <nav className="z-30 bg-white px-8 py-3 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex col gap-10 ">
        <Link
          href="/"
          className="text-gray-800 hover:text-blue-800 font-medium transition-colors"
        >
          Accueil
        </Link>
        <Link
          href="/info"
          className="text-gray-800 hover:text-blue-800 font-medium transition-colors"
        >
          Démo
        </Link>
      </nav>

      <div></div>
    </header>
  );
}
