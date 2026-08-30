import { MainNavbar, Footer } from "@/components/layout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainNavbar />
      <main className="mt-16">{children}</main>
      <Footer />
    </>
  );
}
