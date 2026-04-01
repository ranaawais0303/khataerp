import { getDB } from "@/lib/db";

const db = getDB();

// ➕ CREATE PARTY
export async function POST(req) {
  try {
    const { name, phone, address, type } = await req.json();
    await db.query(
      "INSERT INTO party (name, phone, address, type) VALUES (?, ?, ?, ?)",
      [name, phone, address, type]
    );
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("POST PARTY ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// 📋 GET ALL PARTIES
export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM party where (type='customer' or type='supplier') ORDER BY id DESC");
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    console.error("GET PARTY ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}



// ✏️ UPDATE PARTY
export async function PUT(req) {
  try {
    const { id, name, phone, address, type } = await req.json();
    await db.query(
      "UPDATE party SET name = ?, phone = ?, address = ?, type = ? WHERE id = ?",
      [name, phone, address, type, id]
    );
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("PUT PARTY ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ❌ DELETE PARTY
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await db.query("DELETE FROM party WHERE id = ?", [id]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("DELETE PARTY ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}