import MyImage from "@/components/ui/image";
import { Button } from "@/components/ui/button";

interface BlogPostCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  authorName: string;
  readTime: string;
  publishedAt: string;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function BlogPostCard({
  imageSrc,
  imageAlt,
  title,
  description,
  authorName,
  readTime,
  publishedAt,
}: BlogPostCardProps) {
  return (
    <div className="relative group flex min-w-0 flex-col rounded-2xl border bg-muted/50 bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_2px_1px_--theme(--color-black/4%)] after:pointer-events-none after:absolute after:-inset-[5px] after:-z-1 after:rounded-[calc(var(--radius-xl)+4px)] after:border after:border-border/50 after:bg-clip-padding dark:after:bg-background/72">
      {" "}
      <div className="-m-px border bg-background p-2 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] rounded-t-2xl rounded-b-xl dark:before:shadow-[0_-1px_--theme(--color-white/8%)]">
        <div className="mx-auto w-full max-w-3xl">
          <div className="relative w-full h-44 overflow-hidden">
            <MyImage
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover aspect-video rounded-xl group-hover:opacity-80 transition-opacity"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-8 mt-5 mb-5 px-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <h2 className="scroll-m-20 font-heading text-lg xl:text-xl font-semibold line-clamp-1 group-hover:underline">
                  {title}
                </h2>
                {description && (
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 rounded-b-2xl flex justify-between items-center gap-2">
        <Button variant="outline" size="sm">
          Baca Selengkapnya
        </Button>
        <div className="flex items-center gap-2">
          {/*<Avatar className="h-4 w-4">
            <AvatarFallback className="text-xs">
              {authorName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>*/}

          <span className="text-sm">{formatDate(publishedAt)}</span>
          {/*<span>•</span>
          <span className="text-sm">{readTime} read</span>*/}
        </div>
      </div>
    </div>
  );
}
