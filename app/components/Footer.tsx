import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex justify-center py-6 text-sm">
      <Link href="/privacidade" className="underline-offset-4 hover:underline">
        Privacidade
      </Link>
    </footer>
  );
}
