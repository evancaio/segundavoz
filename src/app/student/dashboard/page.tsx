'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CaseCard from '@/components/CaseCard';

export default function StudentDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [cases, setCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }
        if (status === 'authenticated') {
            fetchCases();
        }
    }, [status]);

    const fetchCases = async () => {
        try {
            const res = await fetch('/api/cases');
            if (res.ok) {
                setCases(await res.json());
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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-navy">Painel do Estudante</h1>
                <p className="text-gray mt-1">Analise casos clínicos e contribua com comentários</p>
            </div>

            {/* Info banner */}
            <div className="card p-5 mb-8 bg-gradient-to-r from-teal/5 to-mint/5 border-teal/10">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-navy text-sm">Dados anonimizados</p>
                        <p className="text-sm text-gray mt-1">Os dados dos pacientes são anonimizados para preservar a privacidade. Seus comentários são visíveis apenas para médicos e residentes.</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="card p-5">
                    <p className="text-3xl font-bold gradient-text">{cases.length}</p>
                    <p className="text-sm text-gray mt-1">Casos Disponíveis</p>
                </div>
                <div className="card p-5">
                    <p className="text-3xl font-bold text-teal">{cases.filter(c => c.status === 'IN_REVIEW').length}</p>
                    <p className="text-sm text-gray mt-1">Em Análise</p>
                </div>
            </div>

            {/* Cases */}
            {cases.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray">Nenhum caso disponível no momento</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cases.map((c) => (
                        <CaseCard
                            key={c.id}
                            id={c.id}
                            title={c.title}
                            specialty={c.specialty}
                            status={c.status}
                            isPaid={c.isPaid}
                            createdAt={c.createdAt}
                            patientName="Paciente Anônimo"
                            href={`/student/cases/${c.id}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
