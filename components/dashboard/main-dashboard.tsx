import { DataTable } from "@/components/layout/sidebar/dashboard/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconArticle, IconPhoto, IconArchive } from "@tabler/icons-react";
import { DynamicHeader } from "@/components/layout/sidebar/dashboard/shared";

export default function MainDashboard({
  blogs,
  redaksiCount = 0,
}: {
  blogs: any[];
  redaksiCount?: number;
}) {
  const publishedCount = blogs.filter((b) => !b.is_archived).length;
  const archivedCount = blogs.filter((b) => b.is_archived).length;
  const photosCount = blogs.filter((b) => b.image_url).length + redaksiCount;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
          <div className="px-4">
            <DynamicHeader />
            <p className="text-muted-foreground mt-1">
              Kelola artikel sekolah dalam satu sistem
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 px-4">
            <Card className="bg-gradient-to-br from-card to-muted/50 border-border/50 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Artikel Terpublikasi
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-full">
                  <IconArticle className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publishedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Artikel yang ditayangkan
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-muted/50 border-border/50 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Aset Foto
                </CardTitle>
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <IconPhoto className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{photosCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Aset foto yang tersimpan di Database
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-muted/50 border-border/50 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Artikel Diarsipkan
                </CardTitle>
                <div className="p-2 bg-amber-500/10 rounded-full">
                  <IconArchive className="h-4 w-4 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{archivedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Artikel yang disembunyikan
                </p>
              </CardContent>
            </Card>
          </div>

          <DataTable data={blogs} />
        </div>
      </div>
    </div>
  );
}
