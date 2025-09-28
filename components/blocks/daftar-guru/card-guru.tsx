import MyImage from "@/components/ui/image";

interface CardGuruProps {
  image_url: string;
  nama: string;
  role: string;
}

export default function CardGuru({ image_url, nama, role }: CardGuruProps) {
  return (
    <div className="max-w-full">
      <div className="group rounded-md">
        <div className="group relative z-10 h-full min-h-[29rem] max-w-full overflow-hidden rounded-xl md:aspect-[2/3]">
          <MyImage
            src={image_url}
            alt={nama}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-white md:px-8">
            <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4">
              {nama}
            </div>
            {role && <div className="mb-8 line-clamp-2">{role}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
