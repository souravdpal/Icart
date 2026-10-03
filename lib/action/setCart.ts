'use server'
import { sql } from "../sql/sql"
import { getUserId } from "../cookies/cookies_querries"
import { error } from "console"
import { cookies } from "next/headers"
import { Row } from "postgres"
import findProduct from "../product/findProduct"

type ReturnObj<T> =
    | { ok: true; data: T, status: number }
    | { ok: false; error: string, status: number }

interface ProductInfo_struct {
    id: string;
    title: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    originalPrice: number;
    discountPercent: number;
    rating: number;
    reviewCount: number;
    tag: string;
    isNew: boolean;
    stock: number;
    image: string;
    affiliateUrl: string;
}

export async function addCartProduct(product_id: string): Promise<ReturnObj<string>> {
    try {
        const prod_amount = 1;
        const UserId = await getUserId()
        if (!UserId) {
            return { ok: false, error: "Invalid user", status: 401 }

        }

        await sql`INSERT INTO cart (id,user_id,product_id,amount)
    VALUES(
    ${crypto.randomUUID()},
    ${UserId.user_id},
    ${product_id},
    ${prod_amount}
    )
    
    `

    } catch (err) {
        console.log(err)
        return { ok: false, error: "Unkown Error", status: 400 }
    }


    return { ok: true, data: "Added to Cart", status: 200 }

}



export async function isCart(prod_id: string): Promise<ReturnObj<boolean>> {
    const UserId = await getUserId()

    if (!UserId) {
        return {
            ok: false,
            error: "Invalid user",
            status: 401
        }
    }

    try {
        const rows = await sql<{ in_cart: boolean }[]>`
            SELECT EXISTS (
                SELECT 1
                FROM cart
                WHERE user_id = ${UserId.user_id}
                  AND product_id = ${prod_id}
            ) AS in_cart
        `

        const inCart = rows[0].in_cart

        return {
            ok: true,
            data: inCart,
            status: 200
        }

    } catch {
        return {
            ok: false,
            error: "Cannot obtain cart status",
            status: 400
        }
    }
}

export async function GetUserCart(): Promise<ReturnObj<Row>> {
    const userid = await getUserId(0)
    if (!userid) {
        return {
            ok: false,
            error: "Invalid user",
            status: 401
        }
    }
    try {
        const rows = await sql`SELECT product_id,amount FROM cart WHERE user_id=${userid.user_id}`
        return {
            ok: true,
            data: rows,
            status: 200
        }
    } catch (err) {
        return {
            ok: false,
            error: "Cannot obtain cart status",
            status: 504
        }

    }

}
export async function getProduct(productId: string): Promise<ReturnObj<ProductInfo_struct>> {
    const ProductInfo = await findProduct(productId)
    try {
        if (!ProductInfo) {
            return {
                ok: false,
                error: `Cannot obtain cart status`,
                status: 404
            }
        }

        return {
            ok: true,
            data: ProductInfo,
            status: 200
        }

    } catch (err) {

        return {
            ok: false,
            error: `Cannot obtain cart status , Error  :${err} `,
            status: 504
        }

    }



}