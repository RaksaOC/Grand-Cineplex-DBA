import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const token = req.cookies.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token.value, secret);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)"],
};
