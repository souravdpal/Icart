import { getUserId } from "../cookies/cookies_querries";
import { sql } from "../sql/sql";
import { Row } from "postgres";


export async function getUserData() {
    const userId:string = (await getUserId()).user_id
    const userData:Row = await sql`select username,name_,email from users where id = ${userId}`
    return userData[0]
}