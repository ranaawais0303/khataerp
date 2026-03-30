import { getDB } from "@/lib/db";

const db = getDB();

// ➕ CREATE TRANSACTION
export async function POST(req) {
  try {
    const { party_id, type, amount, mode, date, details } = await req.json();
    await db.query(
      `INSERT INTO transactions (party_id, type, amount, mode, date, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [party_id, type, amount, mode, date, details]
    );
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("POST TRANSACTION ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// 📋 GET ALL TRANSACTIONS
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.name, p.type
      FROM party p
      ORDER BY p.id ASC
    `);

    return Response.json(rows);
  } catch (err) {
    console.error("GET TRANSACTION ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// 📊 GET TRANSACTIONS BY PARTY
export async function PUT(req) {
  try {
    const { party_id } = await req.json();
    const [rows] = await db.query(
      "SELECT * FROM transactions WHERE party_id = ? ORDER BY date ASC",
      [party_id]
    );
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    console.error("PUT TRANSACTION ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ❌ DELETE TRANSACTION
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await db.query("DELETE FROM transactions WHERE id = ?", [id]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("DELETE TRANSACTION ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}