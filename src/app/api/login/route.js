import { getDB } from "@/lib/db";

const db = getDB();

// 🔑 LOGIN
export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password] // plain-text password check
    );

    if (!rows.length) {
      return new Response(JSON.stringify({ error: "Invalid username or password" }), { status: 401 });
    }

    const user = rows[0];

    return new Response(JSON.stringify({
      success: true,
      user: { id: user.id, name: user.username }
    }), { status: 200 });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}