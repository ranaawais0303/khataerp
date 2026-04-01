import { getDB } from "@/lib/db";

const db = getDB();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const party_id = searchParams.get("party_id");

  const [rows] = await db.query(
    `SELECT * FROM transactions 
     WHERE party_id = ? 
     ORDER BY date ASC`,
    [party_id]
   
  );

  return Response.json(rows);
}