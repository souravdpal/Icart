import postgres from "postgres"
import 'server-only'


const globalForSql = globalThis as unknown as { sql?: ReturnType<typeof postgres> }

export const sql =
  globalForSql.sql ??
  postgres(process.env.DATABASE_URL!, { max: 10, idle_timeout: 20 })

if (process.env.NODE_ENV !== "production") globalForSql.sql = sql