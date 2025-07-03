import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { tables } from "@/utils/tables";
import { Table } from "@/types/Schema";
import { convertDataType } from "@/utils/getInfo";

export async function GET(request: NextRequest) {
  const client = await pool.connect();
  try {
    const tableNames = await client.query(
      `SELECT table_name FROM ${tables.schema.tables} WHERE table_type = 'BASE TABLE' AND table_schema = 'public'`
    );
    const tableColumns = await client.query(
      `SELECT table_name, column_name, data_type FROM ${tables.schema.columns} WHERE table_schema = 'public'`
    );
    const tablesNamesRows = tableNames.rows;
    const tableColumnsRows = tableColumns.rows;
    const tablesData: Table[] = [];
    for (const tableName of tablesNamesRows) {
      const tableColumns = tableColumnsRows.filter(
        (row) => row.table_name === tableName.table_name
      );

      const tableRows = await client.query(
        `SELECT COUNT(*) FROM ${tableName.table_name}`
      );
      const rowCount = parseInt(tableRows.rows[0].count);
      tablesData.push({
        rowCount: rowCount,
        name: tableName.table_name,
        columns: tableColumns.map((row) => ({
          column_name: row.column_name,
          data_type: convertDataType(row.data_type),
        })),
      });
    }

    return NextResponse.json(tablesData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch schema" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
