import Image from "next/image";

export function Header() {
  return (
    <header className="flex items-center justify-center py-4">
      <Image
        src="/brand/logo.jpg"
        alt="ELLA — joias e semijoias"
        width={64}
        height={64}
        priority
      />
    </header>
  );
}
