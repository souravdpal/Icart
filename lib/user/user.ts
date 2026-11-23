import { getUserId } from "../cookies/cookies_querries";
import { prisma } from "../sql/prisma";

export async function getUserData() {
  const u = await getUserId();
  const userId = u?.user_id;
  if (!userId) {
    return { ok: false as const };
  }

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { id: true, username: true, name: true, email: true },
  });

  if (!user) {
    return { ok: false as const };
  }

  return {
    ok: true as const,
    user: {
      id: String(user.id),
      username: user.username,
      name: user.name,
      email: user.email,
    },
  };
}