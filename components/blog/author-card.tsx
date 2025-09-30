import Image from "next/image";

export function AuthorCard() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="https://avatar.iran.liara.run/public/45"
        alt="Admin"
        className="rounded-full w-8 h-8 border border-border object-cover"
        width={24}
        height={24}
      />
      <div className="flex-1">
        <h3 className="text-sm  tracking-tight text-balance font-semibold">
          Admin
        </h3>
        <p className="text-xs text-muted-foreground text-balance">
          Operator Sekolah
        </p>
      </div>
    </div>
  );
}
