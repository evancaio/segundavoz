'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DocumentUploader from '@/components/DocumentUploader';
import PaymentModal from '@/components/PaymentModal';

const specialties = [
    'Cardiologia', 'Neurologia', 'Ortopedia', 'Dermatologia',
    'Ginecologia', 'Pediatria', 'Oncologia', 'Endocrinologia',
    'Psiquiatria', 'Urologia', 'Oftalmologia', 'Outra',
];

export default function NewCasePage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [step, setStep] = useState<'form' | 'payment'>('form');
    const [title, setTitle] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [caseId, setCaseId] = useState<string | null>(null);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentChoice, setPaymentChoice] = useState<'free' | 'paid' | null>(null);

    const handleCreateCase = async (isPaid: boolean) => {
        setLoading(true);

        try {
            // First upload files if any
            let uploadedDocIds: string[] = [];

            if (files.length > 0) {
                // Create the case first, then upload
            }

            const res = await fetch('/api/cases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, specialty, isPaid }),
            });

            if (!res.ok) throw new Error('Falha ao criar caso');

            const newCase = await res.json();
            setCaseId(newCase.id);

            // Upload files
            if (files.length > 0) {
                const formData = new FormData();
                formData.append('caseId', newCase.id);
                files.forEach((file) => formData.append('files', file));
                await fetch('/api/upload', { method: 'POST', body: formData });
            }

            if (isPaid) {
                setShowPayment(true);
            } else {
                router.push(`/cases/${newCase.id}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }

        setLoading(false);
    };

    if (step === 'form') {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-navy">Novo Caso</h1>
                    <p className="text-gray mt-1">Descreva sua situação e envie seus documentos</p>
                </div>

                <div className="space-y-6">
                    <div className="card p-6">
                        <h2 className="font-semibold text-navy mb-4">Informações do Caso</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-navy mb-2">Título do caso</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="input-field"
                                    placeholder="Ex: Dor torácica recorrente"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-navy mb-2">Especialidade</label>
                                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="input-field" required>
                                    <option value="">Selecione a especialidade...</option>
                                    {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-navy mb-2">Descrição detalhada</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="input-field min-h-[150px] resize-y"
                                    placeholder="Descreva seus sintomas, histórico médico relevante, tratamentos anteriores..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="font-semibold text-navy mb-4">Documentos</h2>
                        <DocumentUploader
                            onUploadComplete={(docs) => { }}
                        />
                        {/* Local file management */}
                        <div className="mt-4">
                            <input
                                type="file"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setFiles(Array.from(e.target.files));
                                    }
                                }}
                                className="hidden"
                                id="file-input"
                            />
                            {files.length > 0 && (
                                <div className="space-y-2 mt-3">
                                    <p className="text-sm font-semibold text-navy">{files.length} arquivo(s) selecionado(s)</p>
                                    {files.map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 bg-offwhite rounded-lg text-sm">
                                            <span>📄</span>
                                            <span className="truncate flex-1">{f.name}</span>
                                            <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-danger text-xs">✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setStep('payment')}
                        disabled={!title || !specialty || !description}
                        className="btn-primary w-full disabled:opacity-50"
                    >
                        Continuar para Pagamento
                    </button>
                </div>
            </div>
        );
    }

    // Payment step
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button onClick={() => setStep('form')} className="text-sm text-teal hover:underline flex items-center gap-1 mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
            </button>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-navy">Escolha o tipo de atendimento</h1>
                <p className="text-gray mt-1">Selecione entre fila gratuita ou atendimento prioritário</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Free */}
                <button
                    onClick={() => setPaymentChoice('free')}
                    className={`card p-6 text-left transition-all border-2 ${paymentChoice === 'free' ? 'border-teal shadow-lg' : 'border-transparent hover:border-gray-light/30'
                        }`}
                >
                    <div className="w-12 h-12 rounded-xl bg-offwhite flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-navy">Fila Voluntária</h3>
                    <p className="text-3xl font-bold text-navy mt-2">Grátis</p>
                    <p className="text-sm text-gray mt-2">Parecer emitido por voluntários, sem prazo definido.</p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-dark">
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Parecer completo
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Médico verificado
                        </li>
                    </ul>
                </button>

                {/* Paid */}
                <button
                    onClick={() => setPaymentChoice('paid')}
                    className={`card p-6 text-left transition-all border-2 relative overflow-hidden ${paymentChoice === 'paid' ? 'border-teal shadow-lg' : 'border-transparent hover:border-gray-light/30'
                        }`}
                >
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-teal to-mint text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                        RECOMENDADO
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-navy">Prioritário</h3>
                    <p className="text-3xl font-bold mt-2">
                        <span className="text-navy">R$ </span>
                        <span className="gradient-text">40</span>
                    </p>
                    <p className="text-sm text-gray mt-2">Resposta garantida em até 48 horas.</p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-dark">
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Parecer em 48h
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Prioridade na fila
                        </li>
                    </ul>
                </button>
            </div>

            <button
                onClick={() => handleCreateCase(paymentChoice === 'paid')}
                disabled={!paymentChoice || loading}
                className="btn-primary w-full mt-8 disabled:opacity-50"
            >
                {loading ? 'Criando caso...' : paymentChoice === 'paid' ? 'Prosseguir para Pagamento' : 'Enviar Caso Gratuito'}
            </button>

            {showPayment && caseId && (
                <PaymentModal
                    caseId={caseId}
                    onSuccess={() => router.push(`/cases/${caseId}`)}
                    onClose={() => {
                        setShowPayment(false);
                        router.push(`/cases/${caseId}`);
                    }}
                />
            )}
        </div>
    );
}
