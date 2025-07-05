import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
};
