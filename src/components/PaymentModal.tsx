'use client';

import { useState } from 'react';

interface PaymentModalProps {
    caseId: string;
    onSuccess: () => void;
    onClose: () => void;
}

export default function PaymentModal({ caseId, onSuccess, onClose }: PaymentModalProps) {
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState<'form' | 'success'>('form');

    const handlePayment = async () => {
        setProcessing(true);

        try {
            // Create payment session
            const sessionRes = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ caseId }),
            });

            if (!sessionRes.ok) throw new Error('Falha ao criar sessão');
            const { sessionId } = await sessionRes.json();

            // Mock: auto-confirm the payment
            const webhookRes = await fetch('/api/payment/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId }),
            });

            if (webhookRes.ok) {
                setStep('success');
                setTimeout(() => onSuccess(), 2000);
            }
        } catch (error) {
            console.error('Payment error:', error);
        }

        setProcessing(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                {step === 'form' ? (
                    <>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-teal to-mint p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Pagamento Prioritário</h3>
                                    <p className="text-white/80 text-sm">Parecer em até 48 horas</p>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            <div className="text-center">
                                <p className="text-4xl font-bold text-navy">R$ <span className="gradient-text">40</span></p>
                                <p className="text-sm text-gray mt-1">pagamento único por caso</p>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 p-3 bg-offwhite rounded-xl">
                                    <svg className="w-5 h-5 text-mint shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-navy">Parecer em até <strong>48 horas</strong></span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-offwhite rounded-xl">
                                    <svg className="w-5 h-5 text-mint shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-navy">Médico <strong>especialista</strong> verificado</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-offwhite rounded-xl">
                                    <svg className="w-5 h-5 text-mint shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-navy">Documento <strong>confidencial</strong></span>
                                </div>
                            </div>

                            {/* Mock credit card */}
                            <div className="space-y-3">
                                <div className="input-field bg-offwhite text-gray text-sm" style={{ pointerEvents: 'none' }}>
                                    4242 4242 4242 4242
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="input-field bg-offwhite text-gray text-sm" style={{ pointerEvents: 'none' }}>
                                        12/28
                                    </div>
                                    <div className="input-field bg-offwhite text-gray text-sm" style={{ pointerEvents: 'none' }}>
                                        123
                                    </div>
                                </div>
                                <p className="text-xs text-gray text-center">🔒 Sandbox — nenhuma cobrança real será feita</p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={onClose} className="btn-secondary flex-1">
                                    Cancelar
                                </button>
                                <button
                                    onClick={handlePayment}
                                    disabled={processing}
                                    className="btn-primary flex-1 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Processando...
                                        </span>
                                    ) : (
                                        'Pagar R$40'
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-mint/10 flex items-center justify-center animate-pulse-glow">
                            <svg className="w-10 h-10 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-navy mb-2">Pagamento Confirmado!</h3>
                        <p className="text-gray">Seu caso será analisado com prioridade em até 48h.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
