import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { tables } from "@/utils/tables";
import { DashboardData } from "@/types/DashboardData";

export const GET = async (req: NextRequest) => {
  let data: DashboardData = {
    numOfUsers: 0,
    numOfRoles: 0,
    databaseSize: 0,
    totalBackups: 0,
    numOfTables: 0,
    numOfViews: 0,
    numOfIndexes: 0,
    numOfTriggers: 0,
    recentActivities: [],
  };
  const client = await pool.connect();
  try {
    const numOfUsers = await client.query(
      `SELECT COUNT(*) FROM ${tables.roles.pg_user}`
    );
    const numOfRoles = await client.query(
      `SELECT COUNT(*) FROM ${tables.roles.pg_roles}`
    );
    const databaseSize = await client.query(
      `SELECT pg_size_pretty(pg_database_size('${process.env.DATABASE_NAME}'))`
    );
    const numOfTables = await client.query(
      `SELECT COUNT(*) FROM ${tables.metadata.pg_tables}`
    );
    const numOfViews = await client.query(
      `SELECT COUNT(*) FROM ${tables.metadata.pg_views}`
    );
    const numOfIndexes = await client.query(
      `SELECT COUNT(*) FROM ${tables.metadata.pg_indexes}`
    );
    const numOfTriggers = await client.query(
      `SELECT COUNT(*) FROM ${tables.metadata.pg_trigger}`
    );
    const recentActivities = await client.query(
      `SELECT usename, client_addr, state, backend_start FROM ${tables.activity.pg_stat_activity} ORDER BY backend_start DESC LIMIT 10`
    );
    data = {
      numOfUsers: numOfUsers.rows[0].count,
      numOfRoles: numOfRoles.rows[0].count,
      databaseSize: databaseSize.rows[0].pg_size_pretty,
      totalBackups: 0,
      numOfTables: numOfTables.rows[0].count,
      numOfViews: numOfViews.rows[0].count,
      numOfIndexes: numOfIndexes.rows[0].count,
      numOfTriggers: numOfTriggers.rows[0].count,
      recentActivities: recentActivities.rows.map((row: any) => ({
        usename: row.usename || "Unknown",
        ip: row.client_addr || "Unknown",
        status: row.state || "Unknown",
        backend_start: new Date(row.backend_start) || new Date(),
      })),
    };
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
};
