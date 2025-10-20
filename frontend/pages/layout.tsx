import Head from "next/head";
import AnimatedBackground from "../components/AnimatedBackground";
import FooterComponent from "../components/FooterComponent";
import HeaderComponent from "../components/HeaderComponent";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({
  children,
  title = "File Transfer App",
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Application de transfert de fichiers simple et sécurisée"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col overflow-x-hidden">
        {/* Header */}
        <HeaderComponent />

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 sm:py-8">
          {children}
          <AnimatedBackground />
        </main>

        {/* Footer */}
        <FooterComponent />
      </div>
    </>
  );
}
