import { LoginForm } from "@/components/auth";
import { ThemeToggle } from "@/components/layout/header/shared";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden md:block">
        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 10],
            [10, 15],
            [15, 10],
            [10, 15],
            [15, 10],
          ]}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-0%] h-[80%] skew-y-12",
          )}
        />
        <div className="flex flex-col justify-center h-screen items-start max-w-xl mx-auto gap-4">
          <q className="italic text-lg">
            Dunia pendidikan tak lepas dari para pengajar alias guru, para
            pejuang tulus tanpa tanda jasa yang mencerdaskan kehidupan bangsa.
          </q>
          <span className="font-bold">- Ki Hajar Dewantara</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 border-l border-border">
        <div className="flex justify-between  items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/logo-smp.png"
              className="w-20"
              alt="Logo"
              width={100}
              height={100}
            />
            <span className="text-xs font-semibold text-foreground">
              SMP Negeri 04 Muncar Satu Atap <br /> Muncar Banyuwangi
            </span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
