
import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";


type Role = "admin" | "student" | "teacher" | "parent";
const protectedRoutes = Object.keys(routeAccessMap);
const isProtectedRoute = createRouteMatcher(protectedRoutes);


export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth();
  const pathname = req.nextUrl.pathname;

  if (userId && (pathname === "/" || pathname === "/sign-in")) {
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata.role as Role | undefined;

    if (role) {
      const roleRedirectMap: Record<Role, string> = {
        admin: "/admin",
        teacher: "/teacher",
        student: "/student",
        parent: "/parent",
      };

      const redirectUrl = roleRedirectMap[role];
      if (redirectUrl && pathname !== redirectUrl) {
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
    }
  }

  // Skip role check for unprotected routes
  if (!isProtectedRoute(req)) {
    return NextResponse.next();
  }

  // Not signed in
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);

    if (pathname !== "/sign-in") {
      signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
    }


    return NextResponse.redirect(signInUrl);
  }
  try {
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata.role as Role | undefined;

    if (!role) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Check if user's role is allowed for this route
    for (const pattern in routeAccessMap) {
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(pathname)) {
        const allowedRoles = routeAccessMap[pattern];
        if (!allowedRoles.includes(role)) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);
    return NextResponse.redirect(new URL("/error", req.url));
  }
});

// Basic middleware stub to allow all requests when Clerk is disabled
// export default function middleware(req: Request) {
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/student/:path*",
//     "/teacher/:path*",
//     "/parent/:path*",
//     "/list/:path*",
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };
