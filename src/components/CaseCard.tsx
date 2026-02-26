'use client';

import Link from 'next/link';
import StatusBadge from './StatusBadge';

interface CaseCardProps {
    id: string;
    title: string;
    specialty: string;
    status: string;
    isPaid: boolean;
    createdAt: string;
    deadline?: string | null;
    patientName?: string;
    doctorName?: string;
    href: string;
}

export default function CaseCard({
    id,
    title,
    specialty,
    status,
    isPaid,
    createdAt,
    deadline,
    patientName,
    doctorName,
    href,
}: CaseCardProps) {
    const isOverdue = deadline && new Date(deadline) < new Date() && status !== 'COMPLETED';

    return (
        <Link href={href} className="block group">
            <div className="card hover:border-teal/20 relative overflow-hidden">
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal to-mint opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <StatusBadge status={status} />
                            {isPaid && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-mint/10 text-mint font-semibold border border-mint/20">
                                    Prioritário
                                </span>
                            )}
                            {isOverdue && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-danger/10 text-danger font-semibold border border-danger/20">
                                    Atrasado
                                </span>
                            )}
                        </div>
                        <h3 className="font-semibold text-navy group-hover:text-teal transition-colors truncate">
                            {title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray">
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                {specialty}
                            </span>
                            {patientName && (
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {patientName}
                                </span>
                            )}
                            {doctorName && (
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Dr(a). {doctorName}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="text-right text-xs text-gray shrink-0">
                        <p>{new Date(createdAt).toLocaleDateString('pt-BR')}</p>
                        {deadline && (
                            <p className={`mt-1 ${isOverdue ? 'text-danger font-semibold' : ''}`}>
                                Prazo: {new Date(deadline).toLocaleDateString('pt-BR')}
                            </p>
                        )}
                    </div>
                </div>

                {/* Hover arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all">
                    <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    );
}
