import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const name = req.nextauth.token?.name as string;
    const verified = req.nextauth.token?.verified as boolean;
    const status = req.nextauth.token?.status as string;

    if (!!req.nextUrl.pathname && (!name || !verified)) {
      return NextResponse.rewrite(new URL("/wait", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/users") && status !== "admin") {
      return NextResponse.rewrite(new URL("/notfound", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/", "/stand", "/users"],
};
