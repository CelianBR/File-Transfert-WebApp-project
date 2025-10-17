import Image from "next/image";

export default function infoPage() {
  return (
    <>
      <div className="w-auto bg-amber-300 flex flex-row justify-around">
        <div className="w-full bg-amber-900">
          <div>
            <Image
              src="/Architecture.png"
              width={150}
              height={150}
              alt="Picture of the code"
            />
          </div>
        </div>

        <div className="w-full bg-emerald-400">
          <h1>P.O.C</h1>
          <h3>Technologie </h3>

          <li>React / Next.js</li>
          <div>
            <p>
              React et Next.js sont la base du frontend de l'entreprise, le POC
              etant de petite taille il est compliqué d'utiliser la totalité des
              fonctionnalitées de React et NEXT.js{" "}
            </p>
          </div>
          <li>Typescript</li>
          <p>
            Typescript est le socle de codage de l'entreprise, le front mais
            aussi la partie serveur sont codés e Typescript surcouche de
            Javascript.
          </p>
          <li>Node.js / Express</li>
          <p>
            Dans la configuration des serveurs de l'entreprise on retrouve un
            CMS
          </p>
        </div>
      </div>
    </>
  );
}
