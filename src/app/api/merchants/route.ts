import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const sql = getDb();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  let merchants;
  if (category && category !== "All") {
    merchants = await sql`SELECT * FROM merchants WHERE verified = true AND category = ${category} ORDER BY rating DESC`;
  } else if (search) {
    merchants = await sql`SELECT * FROM merchants WHERE verified = true AND (business_name ILIKE ${'%' + search + '%'} OR category ILIKE ${'%' + search + '%'}) ORDER BY rating DESC`;
  } else {
    merchants = await sql`SELECT * FROM merchants WHERE verified = true ORDER BY rating DESC`;
  }
  return NextResponse.json(merchants);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "merchant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const sql = getDb();
  await sql`UPDATE merchants SET
    business_name = ${data.business_name},
    category = ${data.category},
    description = ${data.description || null},
    address = ${data.address},
    phone = ${data.phone || null},
    discount_percent = ${data.discount_percent || 0},
    updated_at = NOW()
    WHERE user_id = ${session.user.id}`;
  return NextResponse.json({ success: true });
}