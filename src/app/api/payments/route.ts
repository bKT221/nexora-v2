import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const payments = await db.payment.findMany();
    const stats = await db.payment.aggregate();
    return NextResponse.json({ payments, totalRevenue: stats._sum.amount });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}
