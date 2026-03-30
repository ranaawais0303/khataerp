import mysql from "mysql2/promise";

// export const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
// });

// import mysql from 'mysql2/promise';

// export async function connectToDatabase() {
//   const connection = await mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT
//   });

//   return connection;
// }

//local
// export const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "magnus00", // 🔥 put your MySQL password
//   database: "digikhata",
// });


//live server
let pool;

export function getDB() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,       // Railway host
      user: process.env.DB_USER,       // Railway user
      password: process.env.DB_PASSWORD, // Railway password
      database: process.env.DB_NAME,   // Railway database
      port: process.env.DB_PORT,       // Railway port
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}