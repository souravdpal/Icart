import 'server-only'
import argon2 from "argon2";

export async function hashPassword(password: string) {
    return await argon2.hash(password,
        {
            type: argon2.argon2i,
            memoryCost: 19456,
            timeCost: 2,
            parallelism: 1,
        }
    )

}
interface v_p{
    password : string,
    passwordHash : string
}

export async function verifyPassword(pass:v_p) {
    return await argon2.verify(pass.passwordHash , pass.password)
    
}