export const routeConfig = {
  // Routes yang bisa diakses tanpa login
  public: [
    "/",
    "/auth/(.*)", // semua routes di /auth
    "/api/auth/(.*)", // auth API routes
    "/unauthorized",
    "/profile",
    "/articles",
    "/article/(.*)",
    "/daftar-guru",
    "/gallery",
  ],

  // Routes yang butuh role admin
  admin: ["/dashboard"],

  // Routes auth (redirect jika sudah login)
  auth: ["/auth/login", "/auth/register"],
};

// Helper function untuk check routes
export function isRouteMatch(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    if (route.includes("(.*)")) {
      // Handle wildcard routes
      const regex = new RegExp(`^${route.replace("(.*)", ".*")}$`);
      return regex.test(pathname);
    }
    return pathname === route || pathname.startsWith(route + "/");
  });
}
