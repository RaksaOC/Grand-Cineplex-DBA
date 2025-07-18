import pool from "@/config/db";
import { verifyToken } from "@/config/verifyToken";
import { tables } from "@/utils/tables";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { role: string } }
) => {
  const client = await pool.connect();
  await verifyToken(request);
  try {
    const { role } = params;
    await client.query(`DROP ROLE ${role}`);
    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: "Failed to delete role: " + error },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};
