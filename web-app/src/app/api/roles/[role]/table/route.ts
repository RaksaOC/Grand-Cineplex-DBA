import pool from "@/utils/db";
import { tables } from "@/utils/tables";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { role: string } }
) => {
  const client = await pool.connect();
  const { role } = await params;
  try {
    const { updatedTables } = await request.json();

    // get all tables that the role has access to
    const currentTables = await client.query(
      `SELECT distinct table_name FROM ${tables.privileges.role_table_grants} WHERE grantee = '${role}'`
    );
    // get all tables names that the role has access to
    const currentTablesNames = currentTables.rows.map(
      (table) => table.table_name
    );

    if (updatedTables.length > currentTablesNames.length) {
      console.log(
        "tables are added, updatedTables, currentTablesNames",
        updatedTables,
        currentTablesNames
      );
      // find the added tables
      const addedTables = updatedTables.filter(
        (table) => !currentTablesNames.includes(table)
      );
      // grant select privileges on all added tables
      for (const table of addedTables) {
        await client.query(`GRANT SELECT ON TABLE ${table} TO ${role}`);
      }
      return NextResponse.json(
        {
          message: "Table access of role updated successfully",
        },
        { status: 200 }
      );
    }

    console.log(
      "tables are removed, updatedTables, currentTablesNames",
      updatedTables,
      currentTablesNames
    );
    // find tables thats been removed
    const removedTables = currentTablesNames.filter(
      (table) => !updatedTables.includes(table)
    );
    // revoke all privileges on all removed tables
    for (const table of removedTables) {
      await client.query(`REVOKE ALL ON TABLE ${table} FROM ${role}`);
    }

    return NextResponse.json(
      {
        message: "Table access of role updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};
