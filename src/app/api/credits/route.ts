import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { CreditService } from '@/lib/credit-service';

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const credits = await CreditService.getUserCredits(session.user.id);
    const history = await CreditService.getCreditHistory(session.user.id, 20);

    return NextResponse.json({
      success: true,
      credits,
      history,
    });
  } catch (error) {
    console.error('Error fetching credit info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credit information' },
      { status: 500 }
    );
  }
}