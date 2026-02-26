import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createPaymentSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const body = await req.json();
        const { caseId } = body;

        if (!caseId) {
            return NextResponse.json({ error: 'caseId é obrigatório' }, { status: 400 });
        }

        const paymentSession = createPaymentSession(caseId, 40);

        return NextResponse.json({
            sessionId: paymentSession.id,
            url: paymentSession.url,
        });
    } catch (error) {
        console.error('Payment create error:', error);
        return NextResponse.json({ error: 'Erro ao criar sessão de pagamento' }, { status: 500 });
    }
}
