import { NextRequest, NextResponse } from "next/server";
import pool from "@/config/db";
import { verifyToken } from "@/config/verifyToken";

export const GET = async (request: NextRequest) => {
  const client = await pool.connect();
  await verifyToken(request);
  try {
    const data = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    return NextResponse.json(data.rows.map((row) => row.table_name));
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json(
      { error: "Failed to fetch tables" },
      { status: 500 }
    );
  } finally {
    await client.release();
  }
};
