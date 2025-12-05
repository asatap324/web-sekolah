import { Avatar, AvatarFallback } from "@/components/ui/avatar";
export function AuthorCard() {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback className="text-xs">AD</AvatarFallback>
      </Avatar>
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
