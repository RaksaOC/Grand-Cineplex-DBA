import { NextResponse } from "next/server";
import pool from "@/app/utils/db";

export async function GET() {
  try {
    const client = await pool.connect();

    const result = await client.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.status,
        u.last_login,
        u.created_at,
        r.name as role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `);

    client.release();

    return NextResponse.json({
      users: result.rows,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { username, email, role_id, password } = await request.json();
    const client = await pool.connect();

    const result = await client.query(
      `
      INSERT INTO users (username, email, role_id, password_hash, status, created_at)
      VALUES ($1, $2, $3, $4, 'active', NOW())
      RETURNING id, username, email, status, created_at
    `,
      [username, email, role_id, password]
    ); // Note: In production, hash the password

    client.release();

    return NextResponse.json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
