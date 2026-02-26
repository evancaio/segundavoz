'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/StatusBadge';

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [cases, setCases] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        if (status === 'authenticated') fetchData();
    }, [status]);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/cases');
            if (res.ok) setCases(await res.json());
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-teal/20 border-t-teal animate-spin" /></div>;

    const stats = {
        total: cases.length,
        pending: cases.filter(c => c.status === 'PENDING').length,
        inReview: cases.filter(c => c.status === 'IN_REVIEW').length,
        completed: cases.filter(c => c.status === 'COMPLETED').length,
        paid: cases.filter(c => c.isPaid).length,
        revenue: cases.filter(c => c.isPaid).reduce((sum: number, c: any) => sum + (c.amount || 0), 0),
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-navy">Painel Administrativo</h1>
                <p className="text-gray mt-1">Visão geral da plataforma</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {[
                    { label: 'Total', value: stats.total, color: 'from-navy to-navy-light', text: 'text-white', sub: 'text-white/70' },
                    { label: 'Pendentes', value: stats.pending, color: 'from-warning/10 to-warning/5', text: 'text-warning', sub: 'text-gray' },
                    { label: 'Em Análise', value: stats.inReview, color: 'from-teal/10 to-teal/5', text: 'text-teal', sub: 'text-gray' },
                    { label: 'Concluídos', value: stats.completed, color: 'from-mint/10 to-mint/5', text: 'text-mint', sub: 'text-gray' },
                    { label: 'Pagos', value: stats.paid, color: 'from-teal/10 to-mint/5', text: 'gradient-text', sub: 'text-gray' },
                    { label: 'Receita', value: `R$${stats.revenue}`, color: 'from-mint/10 to-mint/5', text: 'text-mint', sub: 'text-gray' },
                ].map((s, i) => (
                    <div key={i} className={`rounded-2xl p-5 bg-gradient-to-br ${s.color}`}>
                        <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                        <p className={`text-xs mt-1 ${s.sub}`}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Cases Table */}
            <div className="card overflow-hidden">
                <div className="p-6 border-b border-navy/5">
                    <h2 className="font-semibold text-navy">Todos os Casos</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-offwhite text-left">
                                <th className="px-6 py-3 font-semibold text-gray text-xs uppercase tracking-wider">Título</th>
                                <th className="px-6 py-3 font-semibold text-gray text-xs uppercase tracking-wider">Paciente</th>
                                <th className="px-6 py-3 font-semibold text-gray text-xs uppercase tracking-wider">Especialidade</th>
                                <th className="px-6 py-3 font-semibold text-gray text-xs uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 font-semibold text-gray text-xs uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 font-semibold text-gray text-xs uppercase tracking-wider">Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy/5">
                            {cases.map((c) => (
                                <tr key={c.id} className="hover:bg-offwhite/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-navy">{c.title}</td>
                                    <td className="px-6 py-4 text-gray">{c.patient?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-gray">{c.specialty}</td>
                                    <td className="px-6 py-4"><StatusBadge status={c.status} size="sm" /></td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.isPaid ? 'bg-mint/10 text-mint' : 'bg-offwhite text-gray'}`}>
                                            {c.isPaid ? 'Pago' : 'Gratuito'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray">{new Date(c.createdAt).toLocaleDateString('pt-BR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
