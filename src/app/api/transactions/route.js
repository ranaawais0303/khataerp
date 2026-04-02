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
      FROM party p where p.type IN ('customer','supplier')
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
  `SELECT t.*, p.name
   FROM transactions t
   JOIN party p ON t.party_id = p.id
   WHERE t.party_id = ?
   ORDER BY t.id ASC`,
  [party_id]
);

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    console.error("PUT TRANSACTION ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// 🔄 UPDATE TRANSACTION
export async function PATCH(req) {
  try {
    const { id, type, amount, mode, date, details } = await req.json();

    if (!id) throw new Error("Transaction ID is required");

    await db.query(
      `UPDATE transactions
       SET type = ?, amount = ?, mode = ?, date = ?, details = ?
       WHERE id = ?`,
      [type, amount, mode, date, details, id]
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("PATCH TRANSACTION ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ❌ DELETE TRANSACTION
// 🗄️ ARCHIVE TRANSACTION
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) throw new Error("Transaction ID is required");

    // Archive instead of delete
    await db.query("UPDATE transactions SET archived = 1 WHERE id = ?", [id]);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("ARCHIVE TRANSACTION ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}