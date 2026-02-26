'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        // Redirect based on role — fetch session to determine
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        const role = session?.user?.role;

        switch (role) {
            case 'DOCTOR':
            case 'RESIDENT':
                router.push('/doctor/dashboard');
                break;
            case 'STUDENT':
                router.push('/student/dashboard');
                break;
            case 'ADMIN':
                router.push('/admin');
                break;
            default:
                router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-offwhite px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal to-mint flex items-center justify-center shadow-xl mb-4">
                        <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-navy">Bem-vindo de volta</h1>
                    <p className="text-gray mt-2">Entre na sua conta SegundaVoz</p>
                </div>

                <div className="glass-card">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm text-center animate-fade-in">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-navy mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-navy mb-2">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Entrando...
                                </span>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray">
                        Não tem conta?{' '}
                        <Link href="/register" className="text-teal font-semibold hover:underline">
                            Cadastre-se
                        </Link>
                    </div>
                </div>

                {/* Demo credentials */}
                <div className="mt-6 p-4 bg-white rounded-xl border border-navy/5 text-xs text-gray">
                    <p className="font-semibold text-navy mb-2">🔑 Credenciais de demo (senha: 123456)</p>
                    <div className="grid grid-cols-2 gap-1">
                        <span>Paciente: roberto@email.com</span>
                        <span>Médica: ana@segundavoz.com</span>
                        <span>Estudante: maria@segundavoz.com</span>
                        <span>Admin: admin@segundavoz.com</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
