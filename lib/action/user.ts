'use server'

import { getUserData } from "../user/user";
import { ProfileData } from "@/app/(main)/u/[id]/components/edit-popup";
import { prisma } from "../sql/prisma";

export async function senduserData() {
    const userdata = await getUserData()
    return userdata
    
}
export async function isAlreadyUser(ck_user: string) {
  try {
    const row = await prisma.users.findFirst({
      where: { username: ck_user },
      select: { username: true },
    })
    return { ok: !!row, status: 200 }
  } catch (e) {
    return { ok: false, err: 'Lookup failed', status: 500 }
  }
}
export async function UpdateUserData(
  identifier: string,
  data: Partial<ProfileData> & { phone?: string; fullAddress?: string },
) {
  const key = identifier?.trim();
  if (!key) {
    return { ok: false, err: 'Missing user identifier', status: 400 };
  }

  const updates: {
    name?: string;
    username?: string;
    address?: string | null;
    phone?: string | null;
  } = {};

  if (data.name?.trim()) updates.name = data.name.trim();
  if (data.username?.trim()) updates.username = data.username.trim();
  if (data.phone !== undefined) updates.phone = data.phone.trim() || null;

  if (data.fullAddress !== undefined) {
    updates.address = data.fullAddress.trim() || null;
  } else {
    const parts = [data.area, data.street, data.landmark]
      .map((p) => p?.trim())
      .filter(Boolean);
    if (parts.length > 0) updates.address = parts.join('-');
  }

  if (Object.keys(updates).length === 0) {
    return { ok: true, status: 200 };
  }

  try {
    const existing = await prisma.users.findFirst({
      where: {
        OR: [
          { id: key },
          { id: key },
        ],
      },
      select: { id: true },
    });

    if (!existing) {
      return { ok: false, err: 'User not found', status: 404 };
    }

    await prisma.users.update({
      where: { id: existing.id },
      data: updates,
    });

    return { ok: true, status: 200 };
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return { ok: false, err: 'Username already taken', status: 409 };
    }
    if (e?.code === 'P2025') {
      return { ok: false, err: 'User not found', status: 404 };
    }
    console.error('UpdateUserData failed:', e);
    return { ok: false, err: 'Failed to update profile', status: 500 };
  }
}