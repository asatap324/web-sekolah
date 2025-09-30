import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MyImage from "@/components/ui/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface BlogPostCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  authorName: string;
  readTime: string;
}

export function BlogPostCard({
  imageSrc,
  imageAlt,
  title,
  description,
  authorName,
  readTime,
}: BlogPostCardProps) {
  return (
    <Card className="bg-card group shadow-none flex flex-col p-0 pb-5 text-card-foreground overflow-hidden h-full rounded-lg border">
      <div className="relative w-full h-40 overflow-hidden">
        <MyImage
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardContent className="px-4 flex-1 space-y-2 pt-4 ">
        <h3 className="text-lg leading-tight font-semibold">{title}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm mt-auto">
          {description}
        </p>
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Avatar className="h-6 w-6">
            <AvatarImage
              alt="avatar-admin"
              src="https://avatar.iran.liara.run/public/45"
              width={24}
              height={24}
            />
            <AvatarFallback>
              {authorName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span>{authorName}</span>
          <span>•</span>
          <span>{readTime} read</span>
        </div>
      </CardFooter>
    </Card>
  );
}
