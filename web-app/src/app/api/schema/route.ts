import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/utils/db";
import { tables } from "@/app/utils/tables";
import { Table } from "@/app/types/Schema";

const convertDataType = (dataType: string) => {
  switch (dataType) {
    case "character varying":
      return "VARCHAR";
    case "integer":
      return "INT";
    case "boolean":
      return "BOOLEAN";
    case "timestamp without time zone":
      return "TIMESTAMP";
    case "text":
      return "TEXT";
    case "date":
      return "DATE";
    case "time without time zone":
      return "TIME";
    case "timestamp with time zone":
      return "TIMESTAMP WITH TIME ZONE";
    case "uuid":
      return "UUID";
    case "jsonb":
      return "JSONB";
    case "json":
      return "JSON";
    case "double precision":
      return "DOUBLE PRECISION";
    case "numeric":
      return "NUMERIC";
    case "real":
      return "REAL";
    case "smallint":
      return "SMALLINT";
    case "bigint":
      return "BIGINT";
    case "smallserial":
      return "SMALLSERIAL";
    case "serial":
      return "SERIAL";
    case "bigserial":
      return "BIGSERIAL";
    case "money":
      return "MONEY";
    case "bytea":
      return "BYTEA";
    case "inet":
      return "INET";
    case "cidr":
      return "CIDR";
    case "macaddr":
      return "MACADDR";
    case "interval":
      return "INTERVAL";
    case "time with time zone":
      return "TIME WITH TIME ZONE";
    case "time without time zone":
      return "TIME WITHOUT TIME ZONE";
    case "timestamp with time zone":
      return "TIMESTAMP WITH TIME ZONE";
    case "timestamp without time zone":
      return "TIMESTAMP WITHOUT TIME ZONE";
    default:
      return dataType;
  }
};

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
