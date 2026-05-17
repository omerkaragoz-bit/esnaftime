import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const merchantId = searchParams.get("merchantId");
  if (!merchantId) return NextResponse.json([]);
  const sql = getDb();
  const reviews = await sql`
    SELECT r.*, u.name as reviewer_name, u.avatar_url as reviewer_avatar
    FROM reviews r JOIN users u ON u.id = r.student_id
    WHERE r.merchant_id = ${merchantId}
    ORDER BY r.created_at DESC LIMIT 20
  `;
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { merchantId, stars, comment } = await req.json();
  const sql = getDb();
  await sql`INSERT INTO reviews (student_id, merchant_id, stars, comment) VALUES (${session.user.id}, ${merchantId}, ${stars}, ${comment || null})`;
  const avg = await sql`SELECT AVG(stars)::numeric(2,1) as avg_rating, COUNT(*)::int as cnt FROM reviews WHERE merchant_id = ${merchantId}`;
  await sql`UPDATE merchants SET rating = ${avg[0].avg_rating}, review_count = ${avg[0].cnt} WHERE id = ${merchantId}`;
  return NextResponse.json({ success: true });
}