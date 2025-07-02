import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/utils/db";

export const POST = async (request: NextRequest) => {
  const { command } = await request.json();
  const client = await pool.connect();
  try {
    const result = await client.query(command);
    if (result.rows.length > 0) {
      return NextResponse.json(result.rows);
    } else {
      return NextResponse.json("No results found");
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to execute command" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};
