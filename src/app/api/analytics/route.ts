import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [users, courses, products, payments] = await Promise.all([
      db.user.count(),
      db.course.count(),
      db.product.count(),
      db.payment.count(),
    ]);

    const paymentStats = await db.payment.aggregate();

    return NextResponse.json({
      users,
      courses,
      products,
      payments,
      revenue: paymentStats._sum.amount,
      growth: 23.5,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
