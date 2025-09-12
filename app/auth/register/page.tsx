import Image from "next/image";
import RegisterForm from "@/components/auth-ui/register/register-form";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <Image
              src="/assets/logo-smp.png"
              className="w-20"
              alt="Logo"
              width={100}
              height={100}
            />
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/assets/redaksi/kemenko1.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full grayscale object-cover"
          width={1200}
          height={600}
        />
      </div>
    </div>
  );
}
