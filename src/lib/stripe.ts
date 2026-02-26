// Mock Stripe integration for sandbox/development
// In production, replace with real Stripe SDK calls

export interface PaymentSession {
    id: string;
    url: string;
    status: 'pending' | 'completed' | 'failed';
    amount: number;
    caseId: string;
}

const sessions = new Map<string, PaymentSession>();

export function createPaymentSession(caseId: string, amount: number): PaymentSession {
    const id = `ps_mock_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const session: PaymentSession = {
        id,
        url: `http://localhost:3000/api/payment/mock-checkout?session_id=${id}`,
        status: 'pending',
        amount,
        caseId,
    };
    sessions.set(id, session);
    return session;
}

export function getPaymentSession(sessionId: string): PaymentSession | undefined {
    return sessions.get(sessionId);
}

export function confirmPayment(sessionId: string): boolean {
    const session = sessions.get(sessionId);
    if (!session) return false;
    session.status = 'completed';
    return true;
}
