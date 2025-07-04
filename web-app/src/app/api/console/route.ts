import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export const POST = async (request: NextRequest) => {
  const client = await pool.connect();
  const { command } = await request.json();
  try {
    const splitCommand = command.split(" ");
    if (
      splitCommand.includes("drop") ||
      splitCommand.includes("delete") ||
      splitCommand.includes("truncate") ||
      splitCommand.includes("alter") ||
      splitCommand.includes("rename") ||
      splitCommand.includes("create") ||
      splitCommand.includes("insert") ||
      splitCommand.includes("update") ||
      splitCommand.includes("grant") ||
      splitCommand.includes("revoke")
    ) {
      return NextResponse.json(
        { error: "This command is not allowed, only for read operations" },
        { status: 400 }
      );
    }
    if (
      splitCommand[splitCommand.length - 1] === "tickets" ||
      splitCommand[splitCommand.length - 1] === "bookings" ||
      splitCommand[splitCommand.length - 1] === "payments" ||
      splitCommand[splitCommand.length - 1] === "seats" ||
      splitCommand[splitCommand.length - 1] === "screenings" ||
      splitCommand[splitCommand.length - 1] === "customers"
    ) {
      return NextResponse.json(
        { error: "Please use limit or offset for this table" },
        { status: 400 }
      );
    }
    const result = await client.query(command);

    if (result.rows.length > 0) {
      return NextResponse.json(result.rows);
    } else {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to execute command: " + error },
      { status: 500 }
    );
  } finally {
    client.release();
  }
};
