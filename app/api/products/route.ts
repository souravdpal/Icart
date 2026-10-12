import { prisma } from "@/lib/sql/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 100;

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const rawLimit = Math.floor(Number(params.get("limit")));
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.min(rawLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

  const cursor = params.get("cursor");
  const isNew = params.get("is_new");

  const where: Prisma.productsWhereInput = {
    ...(isNew === "true" && { is_new: true }),
  };

  const rows = await prisma.products.findMany({
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    where,
    orderBy: { id: "asc" },
  });

  const hasMore = rows.length > limit;
  const ProdData = hasMore ? rows.slice(0, limit) : rows;
  const NextCursor = hasMore ? ProdData[ProdData.length - 1].id : null;

  return NextResponse.json({ ProdData, NextCursor });
}