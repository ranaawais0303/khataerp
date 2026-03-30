import { db } from "@/lib/db";

export async function POST(req) {
  try{
  const body = await req.json();

  const { name, phone, address, type } = body;

  await db.query(
    "INSERT INTO party (name, phone, address, type) VALUES (?, ?, ?, ?)",
    [name, phone, address, type]
  );
  
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message });
  }

  // return Response.json({ success: true });
}

export async function GET() {
  const [rows] = await db.query("SELECT * FROM party ORDER BY id DESC");
  return Response.json(rows);
}