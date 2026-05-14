import { NextRequest, NextResponse } from 'next/server'

// Generate a mock transaction ID
function generateTransactionId(): string {
  const prefix = 'NXR'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

// Simulate processing delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId, method, phone, amount } = body

    // Validate required fields
    if (!userId || !productId || !method || !phone || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: userId, productId, method, phone, amount',
        },
        { status: 400 }
      )
    }

    // Validate payment method
    const validMethods = ['wave', 'orange', 'mtn', 'moov']
    if (!validMethods.includes(method)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid payment method. Must be one of: ${validMethods.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Amount must be a positive number',
        },
        { status: 400 }
      )
    }

    // Validate phone number (basic check)
    if (typeof phone !== 'string' || phone.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid phone number',
        },
        { status: 400 }
      )
    }

    // Simulate processing delay (1.5-3 seconds)
    const processingTime = 1500 + Math.random() * 1500
    await delay(processingTime)

    // Simulate 90% success rate
    const isSuccess = Math.random() < 0.9

    if (isSuccess) {
      const transactionId = generateTransactionId()

      // In production, this would:
      // 1. Call the actual Mobile Money provider API (Wave, Orange, MTN, Moov)
      // 2. Record the transaction in the database
      // 3. Update the product purchase status
      // 4. Credit the seller's earnings
      // 5. Send notification to both buyer and seller

      return NextResponse.json(
        {
          success: true,
          transactionId,
          method,
          amount,
          phone: phone.slice(0, -3) + '***', // Mask phone for security
          productId,
          status: 'completed',
          timestamp: new Date().toISOString(),
          message: 'Paiement traité avec succès',
        },
        { status: 200 }
      )
    } else {
      // Simulate failure scenarios
      const failureReasons = [
        'Solde insuffisant',
        'Délai d\'attente dépassé',
        'Numéro non enregistré',
        'Erreur réseau temporaire',
      ]
      const reason =
        failureReasons[Math.floor(Math.random() * failureReasons.length)]

      return NextResponse.json(
        {
          success: false,
          error: reason,
          method,
          amount,
          productId,
          timestamp: new Date().toISOString(),
        },
        { status: 402 }
      )
    }
  } catch (error) {
    console.error('[Payments API] Error processing payment:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check payment status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const transactionId = searchParams.get('transactionId')

  if (!transactionId) {
    return NextResponse.json(
      { error: 'Transaction ID required' },
      { status: 400 }
    )
  }

  // In production, this would query the database for transaction status
  return NextResponse.json({
    transactionId,
    status: 'completed',
    timestamp: new Date().toISOString(),
  })
}
