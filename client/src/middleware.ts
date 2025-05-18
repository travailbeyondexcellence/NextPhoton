
import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";


type Role = "admin" |"employee" | "educator" | "learner" | "guardian" 
const protectedRoutes = Object.keys(routeAccessMap);
const isProtectedRoute = createRouteMatcher(protectedRoutes);


// const clerkClient: any = clerkClient();


// const validRoutes = [
//   "/", "/sign-in", "/admin", "/employee", "/educator", "/learner", "/guardian",
//   // Add all known routes here (e.g., static and dynamic)
// ];

// function isKnownRoute(pathname: string): boolean {
//   return validRoutes.some((route) => {
//     if (route.includes(":")) {
//       // Handle dynamic routes using param matching
//       const regex = new RegExp("^" + route.replace(/:[^/]+/g, "[^/]+") + "$");
//       return regex.test(pathname);
//     }
//     return pathname === route;
//   });
// }

// if (!isKnownRoute(pathname)) {
//   return NextResponse.next(); // Don't protect unknown routes
// }



export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth();
  const pathname = req.nextUrl.pathname;

  if (userId && (pathname === "/" || pathname === "/sign-in")) {
    const user = await clerkClient().users.getUser(userId);
    const role = user.publicMetadata.role as Role | undefined;

    if (role) {
      const roleRedirectMap: Record<Role, string> = {
        admin: "/admin",
        employee: "/employee", // name added on 13 May 2025
        educator: "/educator", // name changed on 13 May 2025
        learner: "/learner",
        guardian: "/guardian", // name changed on 13 May 2025
      };

      const redirectUrl = roleRedirectMap[role];
      if (redirectUrl && pathname !== redirectUrl) {
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
    }
  }

  if (!isProtectedRoute(req)) {
    return NextResponse.next();
  }

 

  if (isProtectedRoute(req)) {
    auth().protect();
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
    const user = await clerkClient().users.getUser(userId);
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

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}


