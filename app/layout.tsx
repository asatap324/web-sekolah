import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site";
import { metadataKeywords } from "./metadata";
import { TooltipProvider } from "@/components/animate-ui/components/animate/tooltip";
import { getServerUser } from "@/utils/auth-server";
import AuthProvider from "@/providers/auth-provider";
import MainProvider from "@/providers/main-provider";
import LayoutWrapper from "@/providers/layout-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "black",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: metadataKeywords,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialUser = await getServerUser();
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-sidebar`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MainProvider>
            <AuthProvider initialUser={initialUser}>
              <Toaster
                richColors
                position="top-right"
                expand={false}
                toastOptions={{
                  className: "font-sans",
                }}
              />
              <TooltipProvider>
                <LayoutWrapper>{children}</LayoutWrapper>
              </TooltipProvider>
            </AuthProvider>
          </MainProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
