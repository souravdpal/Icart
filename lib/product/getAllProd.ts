import { sql } from "../sql/sql";





export async function getAllProd() {
   const prod = await sql`SELECT * FROM products LIMIT 10`
   return prod

   
}