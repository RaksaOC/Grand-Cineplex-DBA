import pool from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { role: string } }
) => {
  const client = await pool.connect();
  const { role } = await params;
  try {
    const { tables, privileges } = await request.json();
    // revoke all privileges on all tables
    for (const table of tables) {
      await client.query(`REVOKE ALL ON TABLE ${table} FROM ${role}`);
    }
    // grant new privileges
    for (const privilege of privileges) {
      for (const table of tables) {
        await client.query(`GRANT ${privilege} ON TABLE ${table} TO ${role}`);
      }
    }
    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};
