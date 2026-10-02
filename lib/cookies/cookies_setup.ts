import { cookies } from "next/headers";
import { randomUUID, verify } from "crypto";
import { sql } from "../sql/sql";
import { Redirect } from "next";
import { redirect } from "next/dist/server/api-utils";
import { request } from "http";
import { VerfiyRefToken } from "./cookies_querries";


export async function Setcookies(userid: string) {
    const id: string = crypto.randomUUID()
    const session = crypto.randomUUID()
    const refresh_token: string = randomUUID()
    const session_exp = Date.now() + 60 * 15 * 1000
    const refresh_exp = Date.now() + 60 * 60 * 24 * 30 * 1000

    const cookieStore = await cookies()

    await sql`insert into  session (id,session,refresh_token,session_exp,refresh_exp,user_id) values (${id},${session},${refresh_token},${session_exp},${refresh_exp},${userid})`

    cookieStore.set(
        'sessionId', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'lax',
        maxAge: 60 * 15
    }
    )
    cookieStore.set(
        'refreshToken', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'lax',
        maxAge: 60 *60*24*30
    }
    )
    return {isCookiesSet : true}
}

export async function SetNewSessionCookie() {
    const newSession = crypto.randomUUID()
    const T_s:number = 60*15
    const sql_exp = Date.now()+1000*T_s
    const cookiesStore = await cookies()
    const refresh_token:string|undefined = cookiesStore.get("refreshToken")?.value
    
    if (!(await VerfiyRefToken())) {return false}

    if(!refresh_token){
        return false
    }

   try{
     await sql`
    update session 
    set 
    session = ${newSession},
    session_exp = ${sql_exp}
    where refresh_token = ${refresh_token}
    `
    cookiesStore.set(
        'sessionId',newSession ,{
            httpOnly:true,
            secure : process.env.NODE_ENV==="production",
            sameSite : 'lax',
            maxAge  : T_s

        }
    )
   }catch{
    return false
   }
    
    return true


}

