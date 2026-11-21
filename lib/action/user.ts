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
  username: string,
  data: Partial<ProfileData> & { phone?: string; fullAddress?: string },
) {
  const updates: {
    name_?: string
    username?: string
    address?: string | null
    phone?: string | null
  } = {}

  if (data.name?.trim()) updates.name_ = data.name.trim()
  if (data.username?.trim()) updates.username = data.username.trim()
  if (data.phone !== undefined) updates.phone = data.phone.trim() || null

  if (data.fullAddress !== undefined) {
    // Checkout sends one complete address string
    updates.address = data.fullAddress.trim() || null
  } else {
    // Profile popup sends separate parts
    const parts = [data.area, data.street, data.landmark]
      .map((p) => p?.trim())
      .filter(Boolean)
    if (parts.length > 0) updates.address = parts.join('-')
  }

  console.log('UpdateUserData:', { username, updates }) // temporary debug

  if (Object.keys(updates).length === 0) return { ok: true, status: 200 }

  try {
    await prisma.users.update({ where: { username }, data: updates })
    return { ok: true, status: 201 }
  } catch (e: any) {
    console.error('UpdateUserData failed:', e)
    if (e?.code === 'P2002') return { ok: false, err: 'Username already taken', status: 409 }
    return { ok: false, err: 'Failed to update profile', status: 500 }
  }
}