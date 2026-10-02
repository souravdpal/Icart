import { Cookie } from "next/font/google";
import { cookies } from "next/headers";
import { sql } from "../sql/sql";
import { SetNewSessionCookie } from "./cookies_setup";
import { Row } from "postgres";

export async function getUserId(atempt=0) {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("sessionId")?.value
    if(atempt>2){
        return null
    }

    if (!sessionId) {
        const result = await SetNewSessionCookie()

        if (result === false) {
            return null
        }

        return getUserId(atempt+1)
    }

    const user_id_que = await sql`
        SELECT session_exp, user_id
        FROM session
        WHERE session = ${sessionId}
    `

    if (user_id_que.length === 0) {
        const result = await SetNewSessionCookie()

        if (result ===false) {
            return null
        }

        return getUserId(atempt+1)
    }

    if (user_id_que[0].session_exp <= Date.now()) {
        const result = await SetNewSessionCookie()

        if (result === false) {
            return null
        }

        return getUserId(atempt+1)
    }

    return {
        user_id: user_id_que[0].user_id
    }
}


export async function VerfiyRefToken() {
    const cookieStore = await cookies()
    const getRefToken: string | undefined = cookieStore.get("refreshToken")?.value
    if (!getRefToken) {
        return false
    }
    const ref_data: Row[] = await sql`select refresh_exp from session where refresh_token=${getRefToken}`
    if (ref_data.length == 0) {
        return false
    }
    const { refresh_exp } = ref_data[0]
    return refresh_exp > Date.now()




}