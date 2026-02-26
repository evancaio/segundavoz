'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StatusBadge from '@/components/StatusBadge';
import CommentThread from '@/components/CommentThread';

export default function DoctorCaseDetailPage() {
    const { data: session, status } = useSession();
    const params = useParams();
    const router = useRouter();
    const [caseData, setCaseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [opinion, setOpinion] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [accepting, setAccepting] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }
        if (status === 'authenticated' && params.id) {
            fetchCase();
        }
    }, [status, params.id]);

    const fetchCase = async () => {
        try {
            const res = await fetch(`/api/cases/${params.id}`);
            if (res.ok) {
                setCaseData(await res.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const handleAccept = async () => {
        setAccepting(true);
        try {
            const res = await fetch(`/api/cases/${params.id}/accept`, { method: 'POST' });
            if (res.ok) {
                fetchCase();
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setAccepting(false);
    };

    const handleSubmitOpinion = async () => {
        if (!opinion.trim()) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/cases/${params.id}/opinion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: opinion }),
            });
            if (res.ok) {
                fetchCase();
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-teal/20 border-t-teal animate-spin" />
            </div>
        );
    }

    if (!caseData) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-navy">Caso não encontrado</h1>
            </div>
        );
    }

    const isMyCase = caseData.doctorId === (session?.user as any)?.id;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button onClick={() => router.back()} className="text-sm text-teal hover:underline flex items-center gap-1 mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
            </button>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Case info */}
                    <div className="card p-6">
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <StatusBadge status={caseData.status} size="lg" />
                                    {caseData.isPaid && (
                                        <span className="text-xs px-3 py-1 rounded-full bg-mint/10 text-mint font-semibold border border-mint/20">
                                            Prioritário
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-xl font-bold text-navy">{caseData.title}</h1>
                            </div>

                            {!isMyCase && caseData.status === 'PENDING' && (
                                <button
                                    onClick={handleAccept}
                                    disabled={accepting}
                                    className="btn-primary shrink-0 disabled:opacity-50"
                                >
                                    {accepting ? 'Aceitando...' : 'Aceitar Caso'}
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray mb-4">
                            <span>{caseData.specialty}</span>
                            <span>Paciente: {caseData.patient?.name || 'N/A'}</span>
                            <span>{new Date(caseData.createdAt).toLocaleDateString('pt-BR')}</span>
                            {caseData.deadline && (
                                <span>Prazo: {new Date(caseData.deadline).toLocaleDateString('pt-BR')}</span>
                            )}
                        </div>

                        <div className="p-4 bg-offwhite rounded-xl">
                            <p className="text-sm text-gray-dark leading-relaxed">{caseData.description}</p>
                        </div>
                    </div>

                    {/* Documents */}
                    {caseData.documents?.length > 0 && (
                        <div className="card p-6">
                            <h2 className="font-semibold text-navy mb-4">Documentos</h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {caseData.documents.map((doc: any) => (
                                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-offwhite rounded-xl">
                                        <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">📄</div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-navy truncate">{doc.filename}</p>
                                            <p className="text-xs text-gray">{doc.mimetype}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Write opinion */}
                    {isMyCase && caseData.status === 'IN_REVIEW' && !caseData.opinion && (
                        <div className="card p-6">
                            <h2 className="font-semibold text-navy mb-4">Escrever Parecer</h2>
                            <textarea
                                value={opinion}
                                onChange={(e) => setOpinion(e.target.value)}
                                className="input-field min-h-[250px] resize-y mb-4 font-mono text-sm"
                                placeholder={`## Parecer Médico\n\n### Análise dos Exames\n...\n\n### Parecer\n...\n\n### Recomendações\n- ...\n- ...`}
                            />
                            <button
                                onClick={handleSubmitOpinion}
                                disabled={submitting || !opinion.trim()}
                                className="btn-primary w-full disabled:opacity-50"
                            >
                                {submitting ? 'Enviando parecer...' : 'Finalizar e Enviar Parecer'}
                            </button>
                            <p className="text-xs text-gray text-center mt-2">
                                ⚠️ Esta ação é definitiva. O parecer será enviado ao paciente.
                            </p>
                        </div>
                    )}

                    {/* Existing opinion */}
                    {caseData.opinion && (
                        <div className="card p-6">
                            <h2 className="font-semibold text-navy mb-4">Parecer Emitido</h2>
                            <div className="p-4 bg-offwhite rounded-xl text-sm text-gray-dark whitespace-pre-wrap">
                                {caseData.opinion.content}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="card p-6">
                        <CommentThread
                            comments={caseData.comments || []}
                            caseId={caseData.id}
                            canComment={isMyCase}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
