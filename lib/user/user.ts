import { getUserId } from "../cookies/cookies_querries";
import { sql } from "../sql/sql";

export async function getUserData() {
  const u = await getUserId();
  const userId = u?.user_id;

  if (!userId) {
    return { ok: false as const };
  }

  const rows = await sql`
    select username, name_, email
    from users
    where id = ${userId}
  `;

  return rows[0] ?? { ok: false as const };
}