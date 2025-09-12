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
    <Card className="bg-card shadow-none flex flex-col p-0 pb-5 text-card-foreground overflow-hidden h-full rounded-lg border">
      <MyImage
        src={imageSrc}
        alt={imageAlt}
        width={400}
        height={225}
        className="h-48 w-full object-cover"
      />

      <CardContent className="px-4 flex-1 space-y-2 ">
        <h3 className="text-lg leading-tight font-semibold">{title}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm mt-auto">
          {description}
        </p>
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Avatar className="h-6 w-6">
            <AvatarImage src="https://avatar.iran.liara.run/public/45" />
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
