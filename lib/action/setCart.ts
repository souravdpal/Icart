'use server'
import { sql } from "../sql/sql"
import { getUserId } from "../cookies/cookies_querries"
import { error } from "console"
import { cookies } from "next/headers"
import { Row } from "postgres"
import { prisma } from "../sql/prisma"
import { Rose, User } from "lucide-react"
import { ProductInfo_struct } from "@/types/product_struct"
import { toProduct } from "@/types/toProduct"
import { CartItem } from "@/types/products"
import { toCartItem, type CartJoinRow } from "@/types/toCartItem"
import Product from "@/app/(main)/prod/[id]/components/product-card"
import { stat } from "fs"
type ReturnObj<T> =
    | { ok: true; data: T, status: number }
    | { ok: false; error: string, status: number }



export async function addCartProduct(product_id: string): Promise<ReturnObj<string>> {
    try {
        const prod_amount = 1;
        const UserId = await getUserId()
        if (!UserId) {
            return { ok: false, error: "Invalid user", status: 401 }

        }
        const product = await prisma.cart.create({
            data: {
                id: crypto.randomUUID(),
                user_id: UserId.user_id,
                product_id: product_id,
                amount: prod_amount,


            }
        })

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
        const rows = await prisma.cart.findFirst({
            where: {
                user_id: UserId.user_id,
                product_id: prod_id,
            }
        })
        const in_cart: boolean = rows !== null;
        return {
            ok: true,
            data: in_cart,
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
        const rows =await prisma.cart.findMany({
            where: {
                user_id: userid.user_id
            },
            select: {
                product_id: true,
                amount: true,

            },
        })
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
    const ProductInfo = await prisma.products.findUnique({
        where: {
            id: productId,
        }
    })
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
            data: toProduct(ProductInfo),
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
export async function getCartTotal(): Promise<
    ReturnObj<{ total: number; totalProd: number }>
> {
    try {
        const userId = await getUserId();
        if (!userId) {
            return { ok: false, error: "Invalid user", status: 401 };
        }

        const [row] = await sql`
      SELECT
        COALESCE(SUM(p.price * c.amount), 0) AS total,
        COUNT(*)                             AS total_prod
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ${userId.user_id}
    `;

        return {
            ok: true,
            data: {
                total: Number(row.total),
                totalProd: Number(row.total_prod),
            },
            status: 200,
        };
    } catch (err) {
        console.error(err);
        return { ok: false, error: "Could not calculate cart total", status: 500 };
    }
}

export async function UpdateQunat(id: string, Newamount: number): Promise<ReturnObj<String>> {
    const UserId = await getUserId()
    if (!UserId) {
        return { ok: false, error: "Invalid user", status: 401 };

    }
    try {
        const isUpdated = await prisma.cart.updateMany({
            where: {
                user_id: UserId?.user_id,
                product_id: id,
            },
            data: {
                amount: Newamount
            }
        })
        return {
            ok: true,
            data: isUpdated.count > 0 ? "updated" : "not updated",
            status: 201,
        };

    } catch (err) {
        return {
            ok: false,
            error: `Unkown error  : ${err}`,
            status: 404,
        };

    }

}
export async function RemoveCartItem(id: string) {
    const userId = await getUserId()
    if (!userId) {
        return { ok: false, error: "Invalid user", status: 401 };


    }
    try {
        const isRemoved = await prisma.cart.deleteMany({
            where: {
                user_id: userId.user_id,
                product_id: id
            }
        })
        if (isRemoved.count > 0) {
            return {
                ok: true,
                data: "removed",
                stat: 201

            }

        }
        return {
            ok: false,
            error: "cannot remove item",
            stat: 404
        }
    } catch (err) {
        return {
            ok: false,
            err: `Unkown error ${err}`,
            stat: 404
        }

    }


}