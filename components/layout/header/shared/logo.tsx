// components/navbar/logo.tsx
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link
      href="/"
      className={`flex items-center text-primary hover:text-primary/90 ${className}`}
    >
      <Image
        src="/assets/logo-smp.png"
        className="w-[80px] h-auto shrink-0"
        alt="Logo SMP Negeri 04 Muncar Satu Atap"
        width={100}
        height={100}
      />
    </Link>
  );
};
