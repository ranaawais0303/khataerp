import { db } from "@/lib/db";

export async function GET() {
const [rows] = await db.query("SELECT USER() AS user_host");
  return Response.json({ success: true, rows });
}