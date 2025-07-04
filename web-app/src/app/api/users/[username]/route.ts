import pool from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { username: string } }
) => {
  const client = await pool.connect();
  const { username } = await params;
  const { username: newUsername, password } = await request.json();

  try {
    if (password !== "") {
      await client.query(
        `ALTER USER ${username} WITH PASSWORD = ${password}`
      );
    }
    if (newUsername !== username && newUsername !== "") {
      await client.query(`ALTER USER ${username} RENAME TO ${newUsername}`);
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
