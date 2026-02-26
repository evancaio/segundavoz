'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CaseCard from '@/components/CaseCard';

export default function DoctorDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [availableCases, setAvailableCases] = useState<any[]>([]);
    const [myCases, setMyCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'available' | 'mine'>('available');

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
            const [availRes, myRes] = await Promise.all([
                fetch('/api/cases?filter=available'),
                fetch('/api/cases'),
            ]);

            if (availRes.ok) setAvailableCases(await availRes.json());
            if (myRes.ok) setMyCases(await myRes.json());
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

    const role = (session?.user as any)?.role;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-navy">
                    Painel {role === 'RESIDENT' ? 'do Residente' : 'Médico'}
                </h1>
                <p className="text-gray mt-1">Gerencie casos e emita pareceres</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="card p-5">
                    <p className="text-3xl font-bold gradient-text">{availableCases.length}</p>
                    <p className="text-sm text-gray mt-1">Disponíveis</p>
                </div>
                <div className="card p-5">
                    <p className="text-3xl font-bold text-teal">{myCases.filter(c => c.status === 'IN_REVIEW').length}</p>
                    <p className="text-sm text-gray mt-1">Em Análise</p>
                </div>
                <div className="card p-5">
                    <p className="text-3xl font-bold text-mint">{myCases.filter(c => c.status === 'COMPLETED').length}</p>
                    <p className="text-sm text-gray mt-1">Concluídos</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white p-1 rounded-xl mb-6 w-fit">
                <button
                    onClick={() => setTab('available')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'available' ? 'bg-gradient-to-r from-teal to-mint text-white shadow-md' : 'text-gray hover:text-navy'
                        }`}
                >
                    Disponíveis ({availableCases.length})
                </button>
                <button
                    onClick={() => setTab('mine')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'mine' ? 'bg-gradient-to-r from-teal to-mint text-white shadow-md' : 'text-gray hover:text-navy'
                        }`}
                >
                    Meus Casos ({myCases.length})
                </button>
            </div>

            {/* Cases */}
            <div className="space-y-4">
                {tab === 'available' ? (
                    availableCases.length === 0 ? (
                        <div className="card text-center py-12">
                            <p className="text-gray">Nenhum caso disponível no momento</p>
                        </div>
                    ) : (
                        availableCases.map((c) => (
                            <CaseCard
                                key={c.id}
                                id={c.id}
                                title={c.title}
                                specialty={c.specialty}
                                status={c.status}
                                isPaid={c.isPaid}
                                createdAt={c.createdAt}
                                deadline={c.deadline}
                                patientName={c.patient?.name}
                                href={`/doctor/cases/${c.id}`}
                            />
                        ))
                    )
                ) : (
                    myCases.length === 0 ? (
                        <div className="card text-center py-12">
                            <p className="text-gray">Você ainda não aceitou nenhum caso</p>
                        </div>
                    ) : (
                        myCases.map((c) => (
                            <CaseCard
                                key={c.id}
                                id={c.id}
                                title={c.title}
                                specialty={c.specialty}
                                status={c.status}
                                isPaid={c.isPaid}
                                createdAt={c.createdAt}
                                deadline={c.deadline}
                                patientName={c.patient?.name}
                                href={`/doctor/cases/${c.id}`}
                            />
                        ))
                    )
                )}
            </div>
        </div>
    );
}
