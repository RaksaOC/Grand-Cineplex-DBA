import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/utils/db";
import { tables } from "@/app/utils/tables";
interface DashboardData {
    numOfUsers: number;
    roles: number;
    databaseSize: number;
    totalBackups: number;
    numOfTables: number;
    numOfViews: number;
    numOfIndexes: number;
    numOfColumns: number;
    numOfTypes: number;
    numOfConstraints: number;
    numOfTriggers: number;
}

export const GET = async (req: NextRequest) => {

    const data: DashboardData = {
        numOfUsers: 0,
        roles: 0,
        databaseSize: 0,
        totalBackups: 0,
        numOfTables: 0,
        numOfViews: 0,
        numOfIndexes: 0,
        numOfColumns: 0,
        numOfTypes: 0,
        numOfConstraints: 0,
        numOfTriggers: 0,
    };
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM ${tables.metadata.pg_tables}`
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release(); 
  }
};
