import { NextRequest, NextResponse } from "next/server";
import { tables } from "@/utils/tables";
import pool from "@/utils/db";

export const GET = async () => {
  const client = await pool.connect();
  try {
    const users = await client.query(
      `SELECT usename, usesuper, usecreatedb, userepl, usebypassrls, valuntil FROM ${tables.roles.pg_user} WHERE passwd IS NOT NULL`
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
  try {
    await client.query(`CREATE USER ${username} WITH PASSWORD '${password}'`);
    await client.query(`GRANT ${role} TO ${username}`);
    return NextResponse.json({ message: "User created successfully" });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};
