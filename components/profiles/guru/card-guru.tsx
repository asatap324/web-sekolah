import MyImage from "@/components/ui/image";

interface CardGuruProps {
  image_url: string;
  nama: string;
  role: string;
}

export function CardGuru({ image_url, nama, role }: CardGuruProps) {
  return (
    <div className="relative group flex min-w-0 h-full min-h-[28rem] flex-col rounded-2xl border bg-muted/50 bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_2px_1px_--theme(--color-black/4%)] after:pointer-events-none after:absolute after:-inset-[5px] after:-z-1 after:rounded-[calc(var(--radius-xl)+4px)] after:border after:border-border/50 after:bg-clip-padding dark:after:bg-background/72">
      <div className="-m-px border bg-background p-1 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] rounded-t-2xl rounded-b-xl dark:before:shadow-[0_-1px_--theme(--color-white/8%)]">
        <div>
          <div className="relative w-full h-[30rem] overflow-hidden">
            <MyImage
              src={image_url}
              alt={nama}
              fill
              className="object-cover transition-transform duration-300 rounded-xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>

      <div className="rounded-b-2xl flex flex-col justify-between items-center gap-2 py-2">
        <span className="text-lg font-semibold group-hover:underline">
          {nama}
        </span>
        {role && <span className="line-clamp-2">{role}</span>}
      </div>
    </div>
  );
}
