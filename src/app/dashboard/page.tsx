'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CaseCard from '@/components/CaseCard';

export default function PatientDashboard() {
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
                const data = await res.json();
                setCases(data);
            }
        } catch (error) {
            console.error('Error fetching cases:', error);
        }
        setLoading(false);
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-teal/20 border-t-teal animate-spin" />
                    <p className="text-gray">Carregando...</p>
                </div>
            </div>
        );
    }

    const stats = {
        total: cases.length,
        pending: cases.filter((c) => c.status === 'PENDING').length,
        inReview: cases.filter((c) => c.status === 'IN_REVIEW').length,
        completed: cases.filter((c) => c.status === 'COMPLETED').length,
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Meus Casos</h1>
                    <p className="text-gray mt-1">Acompanhe seus pareceres médicos</p>
                </div>
                <Link href="/cases/new" className="btn-primary">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Novo Caso
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total', value: stats.total, color: 'from-navy to-navy-light', textColor: 'text-white' },
                    { label: 'Pendentes', value: stats.pending, color: 'from-warning/10 to-warning/5', textColor: 'text-warning' },
                    { label: 'Em Análise', value: stats.inReview, color: 'from-teal/10 to-teal/5', textColor: 'text-teal' },
                    { label: 'Concluídos', value: stats.completed, color: 'from-mint/10 to-mint/5', textColor: 'text-mint' },
                ].map((stat, i) => (
                    <div key={i} className={`rounded-2xl p-5 bg-gradient-to-br ${stat.color}`}>
                        <p className={`text-3xl font-bold ${i === 0 ? 'text-white' : stat.textColor}`}>{stat.value}</p>
                        <p className={`text-sm mt-1 ${i === 0 ? 'text-white/70' : 'text-gray'}`}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Cases list */}
            {cases.length === 0 ? (
                <div className="card text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-teal/10 flex items-center justify-center">
                        <svg className="w-10 h-10 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-2">Nenhum caso ainda</h3>
                    <p className="text-gray mb-6">Solicite sua primeira segunda opinião médica</p>
                    <Link href="/cases/new" className="btn-primary">
                        Criar Primeiro Caso
                    </Link>
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
                            deadline={c.deadline}
                            doctorName={c.doctor?.name}
                            href={`/cases/${c.id}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
