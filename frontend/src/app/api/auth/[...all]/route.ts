import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

// import { NextRequest, NextResponse } from "next/server";


const betterAuthHandlers = toNextJsHandler(auth.handler);

export const { POST, GET } = toNextJsHandler(auth); 