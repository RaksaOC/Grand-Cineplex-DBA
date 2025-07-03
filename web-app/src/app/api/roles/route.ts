import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/utils/db";
import { tables } from "@/app/utils/tables";
import { RolesData } from "@/app/types/RolesData";

export const GET = async (request: NextRequest) => {
  const client = await pool.connect();
  try {
    const data: RolesData[] = [];

    // Get all non-system roles
    const roles = await client.query(
      `SELECT rolname, rolpassword FROM ${tables.roles.pg_authid} WHERE rolname NOT LIKE 'pg_%' AND rolpassword IS NULL`
    );

    // Get all privileges
    const privileges = await client.query(
      `SELECT grantee, table_name, privilege_type 
       FROM ${tables.privileges.role_table_grants} 
       WHERE table_schema != 'information_schema'
       AND table_schema != 'pg_catalog'
       AND grantee != 'postgres'
       ORDER BY grantee, table_schema, table_name;`
    );

    // Create a map to store privileges by role
    const roleMap = new Map<string, RolesData>();

    // Initialize roles with empty tables array
    roles.rows.forEach((role) => {
      roleMap.set(role.rolname, {
        role: role.rolname,
        tables: [],
      });
    });

    // Group privileges by role and table
    privileges.rows.forEach((privilege) => {
      const roleData = roleMap.get(privilege.grantee);
      if (roleData) {
        // Find existing table entry or create new one
        let tableEntry = roleData.tables.find(
          (t) => t.name === privilege.table_name
        );
        if (!tableEntry) {
          tableEntry = {
            name: privilege.table_name,
            privileges: [],
          };
          roleData.tables.push(tableEntry);
        }
        // Add privilege if not already present
        if (!tableEntry.privileges.includes(privilege.privilege_type)) {
          tableEntry.privileges.push(privilege.privilege_type);
        }
      }
    });

    // Convert map to array
    data.push(...Array.from(roleMap.values()));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};

export const POST = async (request: NextRequest) => {
  const client = await pool.connect();
  try {
    const { role, tables, privileges } = await request.json();
    await client.query(`CREATE ROLE ${role}`);
    for (const privilege of privileges) {
      for (const table of tables) {
        await client.query(`GRANT ${privilege} ON TABLE ${table} TO ${role}`);
      }
    }
    return NextResponse.json({ message: "Role created successfully" });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "Failed to create role" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};

export const PATCH = async (request: NextRequest) => {
  const client = await pool.connect();
  try {
    const { role, tables, privileges } = await request.json();
    // revoke all privileges on all tables
    for (const table of tables) {
      await client.query(`REVOKE ALL ON TABLE ${table} FROM ${role}`);
    }
    // grant new privileges
    for (const privilege of privileges) {
      for (const table of tables) {
        await client.query(`GRANT ${privilege} ON TABLE ${table} TO ${role}`);
      }
    }
    return NextResponse.json({ message: "Role updated successfully" });
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
