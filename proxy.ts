import { withAuth } from "next-auth/middleware";

export const proxy = withAuth(
  function proxy() {},

  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        const role = String(token?.role ?? "");

        if (pathname.startsWith("/admin")) {
          return Boolean(token) && role === "ADMIN";
        }

        if (pathname.startsWith("/dashboard")) {
          return Boolean(token);
        }

        if (pathname.startsWith("/profile")) {
          return Boolean(token);
        }

        if (pathname.startsWith("/daily-challenges")) {
          return Boolean(token);
        }

        if (pathname.startsWith("/quiz")) {
          return Boolean(token);
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/daily-challenges/:path*",
    "/quiz/:path*",
  ],
};
