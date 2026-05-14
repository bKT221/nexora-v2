import { NextRequest, NextResponse } from 'next/server';

// ── POST /api/payments — Mock Mobile Money payment ──────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, method, phone, amount } = body as {
      userId?: string;
      productId?: string;
      method?: string;
      phone?: string;
      amount?: number;
    };

    // Validate required fields
    if (!productId || !method || !phone || !amount) {
      return NextResponse.json(
        { error: 'Données de paiement incomplètes. Veuillez réessayer.' },
        { status: 400 }
      );
    }

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate a mock transaction ID
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      return NextResponse.json({
        success: true,
        transactionId,
        method,
        amount,
        phone,
        productId,
        message: 'Paiement traité avec succès.',
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Le paiement a échoué. Veuillez vérifier votre solde et réessayer.',
          method,
          amount,
        },
        { status: 402 }
      );
    }
  } catch (error: unknown) {
    console.error('Payment API error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du paiement. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
