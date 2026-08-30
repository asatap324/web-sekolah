import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-3">
      <Spinner variant="default" />
      <span>Memuat Artikel...</span>
    </div>
  );
}
