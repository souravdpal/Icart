"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logout() {
  const jar = await cookies()
  jar.delete("refreshToken")
  jar.delete("sessionId")
  redirect('/')
}