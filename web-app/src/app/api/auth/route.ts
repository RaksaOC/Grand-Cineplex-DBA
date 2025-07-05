import pool from "@/config/db";
import { tables } from "@/utils/tables";
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
  const { username, password } = await req.json();

  const poolCheck = new Pool({
    connectionString: `postgres://${username}:${password}@localhost:5432/movie_theater_big`,
  });
  try {
    await poolCheck.connect();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid credentials wrong connection string" + error.message },
      { status: 401 }
    );
  }

  try {
    // if success then we check if the user is truly a superuser
    const superUserCheck = await pool.query(
      `SELECT usename, usesuper FROM ${tables.roles.pg_user} WHERE usename = '${username}'`
    );

    if (superUserCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials or could not find user" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid credentials or is not a superuser" + error.message },
      { status: 401 }
    );
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET || "", {
    expiresIn: "1h",
  });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  const user = await pool.query(
    `SELECT usename FROM ${tables.roles.pg_user} WHERE usename = '${username}'`
  );

  return NextResponse.json({
    message: "Login successful",
    user: user.rows[0].usename,
  });
};
