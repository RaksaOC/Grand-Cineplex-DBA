import { jwtVerify } from "jose";
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { NextRequest, NextResponse } from "next/server";

export const verifyToken = async (request: NextRequest) => {
  const token = request.cookies.get("token");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
};
