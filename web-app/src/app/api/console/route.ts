import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export const POST = async (request: NextRequest) => {
  const client = await pool.connect();
  const { command } = await request.json();
  try {
    const result = await client.query(command);
    if (result.rows.length > 0) {
      return NextResponse.json(result.rows);
    } else {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to execute command", details: error },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};
