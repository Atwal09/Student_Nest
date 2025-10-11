import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db/connection';
import Negotiation from '../../../../../lib/models/Negotiation';
import { verifyAccessToken } from '../../../../../lib/utils/jwt';

/**
 * POST /api/negotiations/[id]/accept-counter
 * Student accepts owner's counter offer
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = await verifyAccessToken(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const userId = decoded.userId;

    await connectDB();

    const negotiation = await Negotiation.findById(resolvedParams.id)
      .populate('room', 'title price availability')
      .populate('student', 'fullName email')
      .populate('owner', 'fullName email');

    if (!negotiation) {
      return NextResponse.json(
        { success: false, error: 'Negotiation not found' },
        { status: 404 }
      );
    }

    // Verify this is the student
    const studentId = typeof negotiation.student === 'object'
      ? (negotiation.student as any)._id
      : negotiation.student;

    if (studentId.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: 'Only the student can accept the counter offer' },
        { status: 403 }
      );
    }

    // Verify negotiation is in countered state
    if (negotiation.status !== 'countered') {
      return NextResponse.json(
        { success: false, error: 'No counter offer to accept. Status: ' + negotiation.status },
        { status: 400 }
      );
    }

    // Check if expired
    if (negotiation.expiresAt && negotiation.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: 'This negotiation has expired' },
        { status: 400 }
      );
    }

    // Accept the counter offer
    negotiation.status = 'accepted';
    negotiation.responseDate = new Date();
    negotiation.finalPrice = negotiation.counterOffer;

    await negotiation.save();

    return NextResponse.json({
      success: true,
      message: 'Counter offer accepted! You can now proceed to book at the negotiated price.',
      data: {
        negotiation: negotiation.toObject(),
        canBook: true,
        finalPrice: negotiation.finalPrice,
        savings: negotiation.originalPrice - negotiation.finalPrice!,
      }
    });

  } catch (error: any) {
    console.error('Accept counter offer error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to accept counter offer' },
      { status: 500 }
    );
  }
}
