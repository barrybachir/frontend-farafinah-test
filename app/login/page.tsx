import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const username = getSession();

  if (username) redirect("/gallery");

  const illustrationSrc =
    "/images/login-illustration.png";

  return (
    <main className="relative min-h-screen bg-[#f5f1e8] overflow-hidden flex items-center justify-center px-4 py-8">

      {/* Logo */}
      <div className="absolute top-10 left-12 z-20">
        <h1 className="text-4xl font-bold text-black">Logo</h1>
      </div>

      {/* Elements décoratifs */}
      <div className="absolute top-40 left-40 text-5xl rotate-12 opacity-50">
        〰
      </div>

      <div className="absolute top-80 left-52 w-16 h-16 border border-gray-500"></div>

      <div className="absolute bottom-40 left-40 w-20 h-40 bg-[#efc078] rounded-sm"></div>

      <div className="absolute bottom-40 left-64 w-20 h-20 border border-gray-400"></div>

      <div className="absolute top-64 right-72 w-16 h-16 border border-gray-400"></div>

      <div className="absolute top-40 right-80 text-5xl opacity-50">
        〰
      </div>

      <div className="absolute bottom-20 right-20 w-16 h-32 bg-[#efc078]"></div>

      {/* Ligne basse */}
      <div className="absolute bottom-24 left-0 w-full border-t border-gray-300"></div>

      {/* Formulaire  */}
      <div className="relative z-10">
        <LoginForm />
      </div>

      {/* Illustration  */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-y-1/2 translate-x-[250px] hidden xl:block">
        <img
          src={illustrationSrc}
          alt="Illustration de connexion"
          className="w-[320px] 2xl:w-[360px] h-auto object-contain opacity-95"
        />
      </div>
    </main>
  );
}