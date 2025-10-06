import { Spinner } from "@/components/ui/spinner";

// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-6">
      <Spinner variant="default" />
    </div>
  );
}
