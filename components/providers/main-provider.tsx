// components/providers/main-provider.tsx
"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function MainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ QueryClient harus dibuat di sini
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 menit
          },
        },
      }),
  );

  return (
    // ✅ Hanya provide QueryClient, tidak ada layout logic
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
