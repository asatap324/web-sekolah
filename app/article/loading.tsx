import { Spinner } from "@/components/ui/spinner";

// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
}
