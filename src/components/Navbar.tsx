'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    const role = (session?.user as any)?.role;

    const getNavLinks = () => {
        if (!session) {
            return [
                { href: '/', label: 'Início' },
                { href: '/login', label: 'Entrar' },
                { href: '/register', label: 'Cadastrar' },
            ];
        }

        switch (role) {
            case 'PATIENT':
                return [
                    { href: '/dashboard', label: 'Meus Casos' },
                    { href: '/cases/new', label: 'Novo Caso' },
                ];
            case 'DOCTOR':
            case 'RESIDENT':
                return [
                    { href: '/doctor/dashboard', label: 'Painel Médico' },
                ];
            case 'STUDENT':
                return [
                    { href: '/student/dashboard', label: 'Painel Estudante' },
                ];
            case 'ADMIN':
                return [
                    { href: '/admin', label: 'Administração' },
                    { href: '/dashboard', label: 'Casos' },
                ];
            default:
                return [];
        }
    };

    const getRoleBadge = () => {
        const badges: Record<string, { label: string; color: string }> = {
            PATIENT: { label: 'Paciente', color: 'bg-teal/20 text-teal' },
            DOCTOR: { label: 'Médico', color: 'bg-mint/20 text-navy' },
            RESIDENT: { label: 'Residente', color: 'bg-warning/20 text-navy' },
            STUDENT: { label: 'Estudante', color: 'bg-navy/20 text-navy' },
            ADMIN: { label: 'Admin', color: 'bg-danger/20 text-danger' },
        };
        return badges[role] || null;
    };

    const links = getNavLinks();
    const badge = getRoleBadge();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-navy/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal to-mint flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-navy">
                            Segunda<span className="gradient-text">Voz</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-gray-dark hover:text-teal rounded-lg hover:bg-teal/5 transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        {session ? (
                            <>
                                {badge && (
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
                                        {badge.label}
                                    </span>
                                )}
                                <span className="text-sm text-gray-dark">{session.user?.name}</span>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="px-4 py-2 text-sm font-medium text-danger hover:bg-danger/5 rounded-lg transition-all"
                                >
                                    Sair
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="btn-primary text-sm !py-2 !px-5">
                                Começar
                            </Link>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-offwhite transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden py-4 border-t border-navy/5 animate-fade-in">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-4 py-3 text-sm text-gray-dark hover:text-teal hover:bg-teal/5 rounded-lg transition-all"
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {session && (
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full text-left px-4 py-3 text-sm text-danger hover:bg-danger/5 rounded-lg transition-all"
                            >
                                Sair
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
