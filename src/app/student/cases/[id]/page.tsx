'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StatusBadge from '@/components/StatusBadge';
import CommentThread from '@/components/CommentThread';

export default function StudentCaseDetailPage() {
    const { data: session, status } = useSession();
    const params = useParams();
    const router = useRouter();
    const [caseData, setCaseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        if (status === 'authenticated' && params.id) fetchCase();
    }, [status, params.id]);

    const fetchCase = async () => {
        const res = await fetch(`/api/cases/${params.id}`);
        if (res.ok) setCaseData(await res.json());
        setLoading(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-teal/20 border-t-teal animate-spin" /></div>;
    if (!caseData) return <div className="max-w-3xl mx-auto px-4 py-12 text-center"><h1 className="text-2xl font-bold text-navy">Caso não encontrado</h1></div>;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button onClick={() => router.back()} className="text-sm text-teal hover:underline flex items-center gap-1 mb-6">← Voltar</button>
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <StatusBadge status={caseData.status} size="lg" />
                            <span className="text-xs px-3 py-1 rounded-full bg-navy/10 text-navy font-semibold">Anonimizado</span>
                        </div>
                        <h1 className="text-xl font-bold text-navy mb-3">{caseData.title}</h1>
                        <div className="flex flex-wrap gap-4 text-sm text-gray mb-4">
                            <span>{caseData.specialty}</span>
                            <span>Paciente Anônimo</span>
                            <span>{new Date(caseData.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="p-4 bg-offwhite rounded-xl">
                            <p className="text-sm text-gray-dark leading-relaxed">{caseData.description}</p>
                        </div>
                    </div>
                    {caseData.documents?.length > 0 && (
                        <div className="card p-6">
                            <h2 className="font-semibold text-navy mb-4">Documentos</h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {caseData.documents.map((doc: any) => (
                                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-offwhite rounded-xl">
                                        <span>📄</span>
                                        <span className="text-sm text-navy truncate">{doc.filename}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="card p-6">
                    <CommentThread comments={caseData.comments || []} caseId={caseData.id} canComment={true} />
                </div>
            </div>
        </div>
    );
}
