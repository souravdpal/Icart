'use server'

import { getUserData } from "../user/user";


export async function senduserData() {
    const userdata = await getUserData()
    return userdata
    
}