/**
 * Script para desactivar los assets subidos con nombres de archivo que contienen espacios.
 * Estos generan URLs inválidas en el navegador.
 * Ejecutar: node scripts/clean-bad-assets.mjs
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

// Deactivate all assets whose fileKey contains spaces
const [rows] = await connection.execute(
  "UPDATE clinic_assets SET active = 'no' WHERE fileKey LIKE '% %'"
);

console.log(`Deactivated ${rows.affectedRows} asset(s) with spaces in fileKey.`);

// Show remaining active assets
const [active] = await connection.execute(
  "SELECT id, category, fileKey, active FROM clinic_assets WHERE active = 'yes'"
);
console.log("Remaining active assets:", active);

await connection.end();
