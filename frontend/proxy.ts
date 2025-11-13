import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"; // 1. Import NextResponse

export default clerkMiddleware(async (auth, req) => {
  // You don't need to await auth() here, just call it
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // 1. If user is logged in and goes on "/"
  if (userId && pathname === "/") {
    const appPageURL = new URL("/app", req.url);
    return NextResponse.redirect(appPageURL);
  }

  // 2. If user is NOT logged in and tries to access any page *other* than "/"
  if (!userId && pathname !== "/") {
    const homePageUrl = new URL("/", req.url);
    return NextResponse.redirect(homePageUrl);
  }

  // 3. If neither of the above, allow the request to continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
