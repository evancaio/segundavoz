'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StatusBadge from '@/components/StatusBadge';
import OpinionViewer from '@/components/OpinionViewer';

export default function CaseDetailPage() {
    const { data: session, status } = useSession();
    const params = useParams();
    const router = useRouter();
    const [caseData, setCaseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
                const data = await res.json();
                setCaseData(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
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
                <button onClick={() => router.back()} className="btn-primary mt-6">Voltar</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back button */}
            <button onClick={() => router.back()} className="text-sm text-teal hover:underline flex items-center gap-1 mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
            </button>

            {/* Header */}
            <div className="card p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <StatusBadge status={caseData.status} size="lg" />
                            {caseData.isPaid && (
                                <span className="text-xs px-3 py-1 rounded-full bg-mint/10 text-mint font-semibold border border-mint/20">
                                    Prioritário
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-navy">{caseData.title}</h1>
                    </div>
                    <div className="text-right text-sm text-gray">
                        <p>Criado em {new Date(caseData.createdAt).toLocaleDateString('pt-BR')}</p>
                        {caseData.deadline && (
                            <p className="mt-1">
                                Prazo: {new Date(caseData.deadline).toLocaleDateString('pt-BR')}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray mb-4">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        {caseData.specialty}
                    </span>
                    {caseData.doctor && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Dr(a). {caseData.doctor.name} — {caseData.doctor.specialty}
                        </span>
                    )}
                </div>

                <div className="p-4 bg-offwhite rounded-xl">
                    <p className="text-sm text-gray-dark leading-relaxed">{caseData.description}</p>
                </div>
            </div>

            {/* Documents */}
            {caseData.documents?.length > 0 && (
                <div className="card p-6 mb-6">
                    <h2 className="font-semibold text-navy mb-4">Documentos Enviados</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {caseData.documents.map((doc: any) => (
                            <div key={doc.id} className="flex items-center gap-3 p-3 bg-offwhite rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-navy truncate">{doc.filename}</p>
                                    <p className="text-xs text-gray">{doc.mimetype}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Opinion */}
            {caseData.opinion && (
                <div className="mb-6 animate-slide-up">
                    <OpinionViewer content={caseData.opinion.content} createdAt={caseData.opinion.createdAt} />
                </div>
            )}

            {/* Status message */}
            {!caseData.opinion && (
                <div className="card p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-teal animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-navy">Aguardando Parecer</h3>
                    <p className="text-gray mt-2">
                        {caseData.status === 'IN_REVIEW'
                            ? 'Seu caso está sendo analisado por um especialista.'
                            : 'Seu caso está na fila e será atribuído a um especialista em breve.'}
                    </p>
                </div>
            )}
        </div>
    );
}
