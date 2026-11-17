'use server'

import { sql } from "@/lib/sql/sql"
import { hashPassword, verifyPassword } from "../user/password"
import { v4 as uuidv4 } from "uuid"
import { Setcookies } from "../cookies/cookies_setup"

type LoginInput = {
  username: string
  password: string
}

type AuthResult =
  | { success: true }
  | { success: false; error: string }

export async function auth_login(data: LoginInput): Promise<AuthResult> {
  if (!data?.username?.trim() || !data?.password) {
    return { success: false, error: "Username and password cannot be empty." }
  }

  const rows = await sql`
    select id, username, passwordhash
    from users
    where username = ${data.username.trim()}
  `
  const user = rows[0]

  // Same message for unknown user and wrong password, so usernames can't be probed
  if (!user) {
    return { success: false, error: "Incorrect username or password." }
  }

  const valid = await verifyPassword({
    passwordHash: user.passwordhash as string,
    password: data.password,
  })

  if (!valid) {
    return { success: false, error: "Incorrect username or password." }
  }

  const { isCookiesSet } = await Setcookies(user.id)
  if (!isCookiesSet) {
    return { success: false, error: "Error logging in, please try again." }
  }

  return { success: true }
}

type RegisterInput = {
  name: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export async function register_user(data: RegisterInput): Promise<AuthResult> {
  if (!data?.name?.trim() || !data?.username?.trim() || !data?.email?.trim()) {
    return { success: false, error: "Please fill in all the fields." }
  }

  if (!data.password || data.password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." }
  }

  if (data.password !== data.confirmPassword) {
    return { success: false, error: "Passwords do not match." }
  }

  let passHash: string
  try {
    passHash = await hashPassword(data.password)
  } catch (e) {
    console.error("[register_user] hash failed", e)
    return { success: false, error: "Could not secure password." }
  }

  try {
    await sql`
      INSERT INTO users (id, username, name_, email, passwordhash)
      VALUES (
        ${uuidv4()},
        ${data.username.trim()},
        ${data.name.trim()},
        ${data.email.trim().toLowerCase()},
        ${passHash}
      )
    `
  } catch (e: any) {
    if (e?.code === "23505") {
      if (e.constraint_name?.includes("email") || e.constraint?.includes("email")) {
        return { success: false, error: "That email is already registered." }
      }
      if (e.constraint_name?.includes("username") || e.constraint?.includes("username")) {
        return { success: false, error: "That username is taken." }
      }
      return { success: false, error: "That account already exists." }
    }

    console.error("[register_user]", e)
    return { success: false, error: "Something went wrong. Please try again." }
  }

  return { success: true }
}