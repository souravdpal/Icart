'use server'
import { error } from "console"
import { sql } from "@/lib/sql/sql"
import { create } from "domain"
import { hashPassword, verifyPassword } from "../user/password"
import { v4 as uuidv4 } from "uuid"
import { use } from "react"
import { Row } from "postgres"
import { Setcookies } from "../cookies/cookies_setup"

export async function auth_login(data: {
  username: string,
  password: string
}) {

  if (!data.username || !data.password) {
    return { success: false, error: "Username password cannot be empty" }
  }

  if (data.username == "" || data.password == "") {
    return { success: false, error: "username password cannot be empty" }
  }

  let login_Server_data =await sql`select id,username,passwordhash from users where Username=${data.username}`
  const user_data:Row = login_Server_data[0]
  const password:string = data.password
  const passwordHash:string = user_data.passwordhash
  const user_id = user_data.id

  let has_obj = {
    passwordHash,
    password
  }

  if (data.username ==user_data.username && await verifyPassword(has_obj)) {
    if((await Setcookies(user_id)).isCookiesSet){
      return { success: true }
    }else{
      return { success: false , error :"Error login try again" }
    }
    
  } else {
    return { success: false, error: "incorrect username or password" }
  }





}


type RegisterInput = {
  name: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

type RegisterResult =
  | { success: true }
  | { success: false; error: string }

export async function register_user(data: RegisterInput): Promise<RegisterResult> {
  if (!data?.name?.trim() || !data?.username?.trim() || !data?.email?.trim()) {
    return { success: false, error: "Please fill in all the fields." }
  }

  if (data.password.length < 8) {
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
    if (e.code === "23505") {
      if (e.constraint?.includes("email")) {
        return { success: false, error: "That email is already registered." }
      }
      if (e.constraint?.includes("username")) {
        return { success: false, error: "That username is taken." }
      }
      return { success: false, error: "That account already exists." }
    }

    console.error("[register_user]", e)
    return { success: false, error: "Something went wrong. Please try again." }
  }

  return { success: true }
}
