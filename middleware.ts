import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},

  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Not logged in
        if (!token) {
          return false;
        }

        // Admin routes protection
        if (pathname.startsWith("/admin")) {
          return token.role === "ADMIN";
        }

        // Student + Admin allowed
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
