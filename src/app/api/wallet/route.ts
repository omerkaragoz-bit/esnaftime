import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sql = getDb();
  const points = await sql`
    SELECT lp.*, m.business_name, m.category, m.logo_url, m.discount_percent
    FROM loyalty_points lp
    JOIN merchants m ON m.id = lp.merchant_id
    WHERE lp.student_id = ${session.user.id}
    ORDER BY lp.total_points DESC
  `;
  return NextResponse.json(points);
}