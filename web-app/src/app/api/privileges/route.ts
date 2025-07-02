import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/utils/db";
import { tables } from "@/app/utils/tables";

export const GET = async (request: NextRequest) => {
  const client = await pool.connect();
  try {
    const data = await client.query(
      `SELECT DISTINCT privilege_type 
       FROM ${tables.privileges.role_table_grants} 
       WHERE table_schema = 'public' 
       ORDER BY privilege_type;`
    );
    return NextResponse.json(data.rows.map((row) => row.privilege_type));
  } catch (error) {
    console.error("Error fetching privileges:", error);
    return NextResponse.json(
      { error: "Failed to fetch privileges" },
      { status: 500 }
    );
  } finally {
    await client.release();
  }
};
