import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Sparkle } from "./components/Sparkle";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center gap-4 py-12">
        <h1 className="text-5xl">ELLA</h1>
        <Sparkle size={32} />
      </main>
      <Footer />
    </>
  );
}
