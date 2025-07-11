import { NextRequest, NextResponse } from "next/server";
import { tables } from "@/utils/tables";
import pool from "@/config/db";
import { verifyToken } from "@/config/verifyToken";

export const GET = async (request: NextRequest) => {
  const client = await pool.connect();
  await verifyToken(request);
  try {
    // TO CHANGE: dropping roles dont work at the moment
    const users = await client.query(
      `SELECT usename, usesuper, usecreatedb, userepl, usebypassrls, valuntil FROM ${tables.roles.pg_user} WHERE passwd IS NOT NULL 
      AND usename != 'michael' AND usename != 'emily' AND usename != 'john' AND usename != 'donald' AND usename != 'maria' AND usename != 'jessica' AND usename != 'henry' AND usename != 'gemma' AND usename != 'jerry'`
    );
    const data = users.rows.map(
      (user: {
        usename: string;
        usesuper: boolean;
        usecreatedb: boolean;
        userepl: boolean;
        usebypassrls: boolean;
        valuntil: string | null;
      }) => ({
        username: user.usename,
        isSuperuser: user.usesuper || false,
        isCreateDB: user.usecreatedb || false,
        isReplicable: user.userepl || false,
        byPassRLS: user.usebypassrls || false,
        passwordExpire: user.valuntil || null,
      })
    );
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};

export const POST = async (request: NextRequest) => {
  const client = await pool.connect();
  const body = await request.json();
  const { username, password, role } = body;
  if (
    username === "michael" ||
    username === "emily" ||
    username === "john" ||
    username === "donald" ||
    username === "maria" ||
    username === "jessica" ||
    username === "henry" ||
    username === "gemma" ||
    username === "jerry"
  ) {
    return NextResponse.json(
      { error: "Cannot create user with these credentials" },
      { status: 400 }
    );
  }
  try {
    await client.query(`CREATE USER ${username} WITH PASSWORD '${password}'`);
    if (role) {
      await client.query(`GRANT ${role} TO ${username}`);
    }
    return NextResponse.json({ message: "User created successfully" });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Failed to create user" + error },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};
