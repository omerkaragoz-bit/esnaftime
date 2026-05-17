import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const { role } = data;
  if (!["student", "merchant"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  const sql = getDb();
  await sql`UPDATE users SET role = ${role}, updated_at = NOW() WHERE email = ${session.user.email!}`;
  
  if (role === "merchant") {
    const existing = await sql`SELECT id FROM merchants WHERE user_id = ${session.user.id}`;
    if (existing.length === 0) {
      const business_name = data.business_name || session.user.name || 'My Business';
      const category = data.category || 'General';
      const address = data.address || 'Address pending';
      const discount_percent = data.discount_percent ? parseInt(data.discount_percent) : 0;
      
      await sql`INSERT INTO merchants (user_id, business_name, category, address, discount_percent) 
                VALUES (${session.user.id}, ${business_name}, ${category}, ${address}, ${discount_percent})`;
    }
  }
  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sql = getDb();
  const rows = await sql`SELECT * FROM users WHERE id = ${session.user.id}`;
  return NextResponse.json(rows[0] || null);
}