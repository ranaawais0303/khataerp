import { db } from "@/lib/db";

// ➕ INSERT TRANSACTION
export async function POST(req) {
  try {
    const body = await req.json();

    const { party_id, type, amount, mode, date, details } = body;

    await db.query(
      `INSERT INTO transactions
       (party_id, type, amount, mode, date, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [party_id, type, amount, mode, date, details]
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error("POST ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// 📋 GET ALL PARTIES
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.name, p.type
      FROM party p
      ORDER BY p.name ASC
    `);

    return Response.json(rows);
  } catch (err) {
    console.error("GET ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// 📊 GET TRANSACTIONS BY PARTY
export async function PUT(req) {
  try {
    const { party_id } = await req.json();

    const [rows] = await db.query(
      `SELECT * FROM transactions
       WHERE party_id = ?
       ORDER BY date ASC`,
      [party_id]
    );

    return Response.json(rows);
  } catch (err) {
    console.error("PUT ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}