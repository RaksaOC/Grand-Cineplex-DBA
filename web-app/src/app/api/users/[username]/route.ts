import pool from "@/config/db";
import { verifyToken } from "@/config/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { username: string } }
) => {
  const client = await pool.connect();
  await verifyToken(request);
  const { username } = params;

  try {
    // Get the user's current role
    const roleResult = await client.query(
      `SELECT r.rolname FROM pg_catalog.pg_roles r 
       JOIN pg_catalog.pg_auth_members m ON m.roleid = r.oid 
       JOIN pg_catalog.pg_roles u ON u.oid = m.member 
       WHERE u.rolname = $1 
       AND r.rolname NOT LIKE 'pg_%'`,
      [username]
    );

    const role = roleResult.rows.length > 0 ? roleResult.rows[0].rolname : null;
    return NextResponse.json({ role });
  } catch (error) {
    console.error("Failed to fetch user role:", error);
    return NextResponse.json(
      { error: "Failed to fetch user role" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { username: string } }
) => {
  const client = await pool.connect();
  await verifyToken(request);
  const { username } = await params;
  const { username: newUsername, password, role } = await request.json();

  try {
    if (password !== "") {
      await client.query(`ALTER USER ${username} WITH PASSWORD '${password}'`);
    }
    if (newUsername !== username && newUsername !== "") {
      await client.query(`ALTER USER ${username} RENAME TO ${newUsername}`);
    }
    if (role !== "") {
      // First revoke all existing roles
      const currentRoles = await client.query(
        `SELECT r.rolname FROM pg_catalog.pg_roles r 
         JOIN pg_catalog.pg_auth_members m ON m.roleid = r.oid 
         JOIN pg_catalog.pg_roles u ON u.oid = m.member 
         WHERE u.rolname = $1`,
        [username]
      );

      for (const roleRow of currentRoles.rows) {
        await client.query(`REVOKE ${roleRow.rolname} FROM ${username}`);
      }

      // Then grant the new role
      await client.query(`GRANT ${role} TO ${username}`);
    }
    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { username: string } }
) => {
  const client = await pool.connect();
  const { username } = await params;
  try {
    await client.query(`DROP USER ${username}`);
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete user: " + error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};
