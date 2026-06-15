import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},

  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        if (pathname.startsWith("/admin")) {
          return Boolean(token);
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
  ],
};