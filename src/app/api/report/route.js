// import { db } from "@/lib/db";

// export async function GET() {
//   const [rows] = await db.query(`
//     SELECT 
//       p.id,
//       p.name,
//       p.type,
//       IFNULL(SUM(
//         CASE 
//           WHEN t.type = 'receive' THEN t.amount
//           WHEN t.type = 'payment' THEN -t.amount
//         END
//       ), 0) AS balance
//     FROM party p
//     LEFT JOIN transactions t ON p.id = t.party_id
//     GROUP BY p.id
//     ORDER BY p.name ASC
//   `);

//   return Response.json(rows);
// }

import { getDB } from "@/lib/db";

const db = getDB();

// 📋 GET ALL PARTIES WITH BALANCE
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.type,
        IFNULL(SUM(
          CASE 
            WHEN t.type = 'receive' THEN t.amount
            WHEN t.type = 'payment' THEN -t.amount
          END
        ), 0) AS balance
      FROM party p
      LEFT JOIN transactions t ON p.id = t.party_id
      GROUP BY p.id
      ORDER BY p.name ASC
    `);

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    console.error("GET PARTY ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}