import pool from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { role: string } }
) => {
  const client = await pool.connect();
  const { role } = await params;
  try {
    const { table, updatedPrivileges } = await request.json();

    // revoke all from that table from that role
    // then grant the updated privileges based on the updatedPrivileges array

    await client.query(`REVOKE ALL ON TABLE ${table} FROM ${role}`);
    console.log("updatedPrivileges", updatedPrivileges);
    for (const privilege of updatedPrivileges) {
      await client.query(`GRANT ${privilege} ON TABLE ${table} TO ${role}`);
    }

    return NextResponse.json(
      {
        message: "Privileges of role updated successfully",
      },
      { status: 200 }
    );
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
