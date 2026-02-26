import { NextRequest, NextResponse } from 'next/server';
import { confirmPayment, getPaymentSession } from '@/lib/stripe';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sessionId } = body;

        if (!sessionId) {
            return NextResponse.json({ error: 'sessionId é obrigatório' }, { status: 400 });
        }

        const session = getPaymentSession(sessionId);
        if (!session) {
            return NextResponse.json({ error: 'Sessão não encontrada' }, { status: 404 });
        }

        const confirmed = confirmPayment(sessionId);
        if (!confirmed) {
            return NextResponse.json({ error: 'Falha ao confirmar pagamento' }, { status: 400 });
        }

        // Update case to paid with deadline
        await prisma.case.update({
            where: { id: session.caseId },
            data: {
                isPaid: true,
                amount: session.amount,
                deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
            },
        });

        return NextResponse.json({ success: true, caseId: session.caseId });
    } catch (error) {
        console.error('Payment webhook error:', error);
        return NextResponse.json({ error: 'Erro ao processar webhook' }, { status: 500 });
    }
}
