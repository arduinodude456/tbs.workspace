import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { ArrowRight, BriefcaseBusiness, Loader2, LockKeyhole, Mail } from "lucide-react";
import Workspace from "./Workspace";

function LoginView() {
  return (
    <main className="min-h-screen bg-[#f7f6f1] p-4 text-[#202321] sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1440px] overflow-hidden rounded-[2rem] bg-[#202a28] shadow-[0_30px_100px_rgba(31,41,39,0.18)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative flex min-h-[390px] flex-col justify-between overflow-hidden p-8 text-[#f7f6f1] sm:p-12 lg:p-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#b7d7cd]/20" /><div className="absolute -bottom-28 -left-16 h-80 w-80 rounded-full border border-[#b7d7cd]/10" />
          <div className="relative flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e2f0eb] text-lg font-black text-[#0f766e]">T</div><div><p className="text-base font-black tracking-[0.2em]">TBS</p><p className="text-[10px] font-semibold tracking-[0.16em] text-[#a9c2bb]">PRIVATE WORKSPACE</p></div></div>
          <div className="relative mt-16 lg:mt-0"><p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#8ed1be]">Your calm control room</p><h1 className="max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-6xl">Alles, was du für deinen Arbeitstag brauchst.</h1><p className="mt-6 max-w-md text-base leading-7 text-[#b8c8c3]">Ein privater Startpunkt für E-Mail, Office und deine wichtigsten Tools – fokussiert, ruhig und unter deiner Kontrolle.</p></div>
          <div className="relative mt-16 flex items-center gap-3 text-xs font-semibold text-[#a9c2bb]"><LockKeyhole className="h-4 w-4 text-[#8ed1be]" />Geschützter Bereich · Manus OAuth</div>
        </section>
        <section className="flex items-center bg-[#f7f6f1] p-8 sm:p-12 lg:p-16"><div className="w-full max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f766e]">Workspace access</p><h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#202321] sm:text-5xl">Willkommen zurück.</h2><p className="mt-5 max-w-md text-base leading-7 text-[#6d746f]">Melde dich an, um deine verknüpften Arbeitsbereiche zu öffnen und den TBS-Workspace zu verwalten.</p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-white p-4 shadow-sm"><Mail className="h-5 w-5 text-[#0f766e]" /><p className="mt-5 text-sm font-semibold">E-Mail</p><p className="mt-1 text-xs leading-5 text-[#818883]">Schneller Einstieg</p></div><div className="rounded-2xl bg-white p-4 shadow-sm"><BriefcaseBusiness className="h-5 w-5 text-[#c7833d]" /><p className="mt-5 text-sm font-semibold">Office</p><p className="mt-1 text-xs leading-5 text-[#818883]">Produktiv arbeiten</p></div><div className="rounded-2xl bg-white p-4 shadow-sm"><ArrowRight className="h-5 w-5 text-[#5e7eae]" /><p className="mt-5 text-sm font-semibold">Apps</p><p className="mt-1 text-xs leading-5 text-[#818883]">Deine Links</p></div></div>
            <Button onClick={() => startLogin()} size="lg" className="mt-10 h-14 w-full rounded-2xl bg-[#0f766e] text-base font-semibold text-white shadow-xl shadow-[#0f766e]/15 transition-transform hover:bg-[#0b625c] active:scale-[0.98]">Mit Manus anmelden <ArrowRight className="ml-2 h-5 w-5" /></Button><p className="mt-5 text-center text-xs leading-5 text-[#909791]">Dein Konto wird über Manus sicher authentifiziert. TBS speichert keine Passwörter.</p>
          </div></section>
      </div>
    </main>
  );
}

export default function Home() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center bg-[#f7f6f1]"><Loader2 className="h-6 w-6 animate-spin text-[#0f766e]" /></div>;
  if (!user) return <LoginView />;
  return <Workspace />;
}
