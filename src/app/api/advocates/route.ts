import db from "../../../db";
import { advocates } from "../../../db/schema";
import { count, or, and, ilike, sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10"))
    );
    const search = (searchParams.get("search") ?? "").trim();
    const offset = (page - 1) * limit;

    const tokens = search
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const where = tokens.length
      ? tokens
          .map((token) =>
            or(
              ilike(advocates.firstName, `%${token}%`),
              ilike(advocates.lastName, `%${token}%`),
              ilike(advocates.city, `%${token}%`),
              ilike(advocates.degree, `%${token}%`),
              sql`${advocates.yearsOfExperience}::text ILIKE ${`%${token}%`}`,
              sql`${advocates.specialties}::text ILIKE ${`%${token}%`}`
            )
          )
          .reduce((acc, cond) => (acc ? and(acc, cond) : cond), undefined)
      : undefined;

    const baseDataQuery = db.select().from(advocates);
    const baseCountQuery = db.select({ count: count() }).from(advocates);

    const dataQuery = where
      ? baseDataQuery.where(where).limit(limit).offset(offset)
      : baseDataQuery.limit(limit).offset(offset);

    const totalQuery = where ? baseCountQuery.where(where) : baseCountQuery;

    const [data, total] = await Promise.all([dataQuery, totalQuery]);

    return Response.json({
      data,
      pagination: {
        page,
        limit,
        total: total[0]?.count ?? 0,
        totalPages: Math.ceil((total[0]?.count ?? 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error in advocates API:", error);
    return Response.json(
      {
        error: "Error fetching advocates.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
