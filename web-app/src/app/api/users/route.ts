import { NextResponse } from "next/server";
import { tables } from "@/app/utils/tables";
import pool from "@/app/utils/db";

export const GET = async () => {
  const client = await pool.connect();
  try {
    const users = await client.query(
      `SELECT usename, usesuper, usecreatedb, userepl, usebypassrls, valuntil FROM ${tables.roles.pg_user}`
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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};
