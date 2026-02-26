'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type RoleType = 'PATIENT' | 'DOCTOR' | 'RESIDENT' | 'STUDENT';

const roles = [
    { value: 'PATIENT' as RoleType, label: 'Paciente', desc: 'Quero solicitar um parecer médico', icon: '🩺' },
    { value: 'DOCTOR' as RoleType, label: 'Médico', desc: 'Quero emitir pareceres', icon: '👨‍⚕️' },
    { value: 'RESIDENT' as RoleType, label: 'Residente', desc: 'Sou residente médico', icon: '🏥' },
    { value: 'STUDENT' as RoleType, label: 'Estudante', desc: 'Sou estudante de medicina', icon: '📚' },
];

const specialties = [
    'Cardiologia', 'Neurologia', 'Ortopedia', 'Dermatologia',
    'Ginecologia', 'Pediatria', 'Oncologia', 'Endocrinologia',
    'Psiquiatria', 'Urologia', 'Oftalmologia', 'Outra',
];

export default function RegisterPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [role, setRole] = useState<RoleType>('PATIENT');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        crm: '',
        specialty: '',
        university: '',
        semester: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role,
                    crm: formData.crm || undefined,
                    specialty: formData.specialty || undefined,
                    university: formData.university || undefined,
                    semester: formData.semester || undefined,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }

            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.message || 'Erro ao cadastrar');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-offwhite px-4 py-12">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-navy">Criar sua conta</h1>
                    <p className="text-gray mt-2">Selecione seu perfil e preencha seus dados</p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    {[1, 2].map((s) => (
                        <div key={s} className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-gradient-to-br from-teal to-mint text-white shadow-lg' : 'bg-white text-gray border-2 border-gray-light/30'
                                }`}>
                                {s}
                            </div>
                            {s < 2 && <div className={`w-16 h-0.5 rounded ${step > 1 ? 'bg-mint' : 'bg-gray-light/30'}`} />}
                        </div>
                    ))}
                </div>

                <div className="glass-card">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-navy mb-4">Qual é o seu perfil?</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {roles.map((r) => (
                                    <button
                                        key={r.value}
                                        onClick={() => setRole(r.value)}
                                        className={`p-4 rounded-xl text-left transition-all border-2 ${role === r.value
                                                ? 'border-teal bg-teal/5 shadow-lg'
                                                : 'border-transparent bg-white hover:border-gray-light/50'
                                            }`}
                                    >
                                        <span className="text-2xl block mb-2">{r.icon}</span>
                                        <p className="font-semibold text-navy text-sm">{r.label}</p>
                                        <p className="text-xs text-gray mt-1">{r.desc}</p>
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setStep(2)} className="btn-primary w-full mt-6">
                                Continuar
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <button type="button" onClick={() => setStep(1)} className="text-sm text-teal hover:underline flex items-center gap-1 mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Voltar
                            </button>

                            {error && (
                                <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm text-center animate-fade-in">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-navy mb-2">Nome completo</label>
                                <input name="name" type="text" value={formData.name} onChange={handleChange} className="input-field" placeholder="Seu nome" required />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-navy mb-2">Email</label>
                                <input name="email" type="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="seu@email.com" required />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-navy mb-2">Senha</label>
                                    <input name="password" type="password" value={formData.password} onChange={handleChange} className="input-field" placeholder="••••••" required minLength={6} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-navy mb-2">Confirmar</label>
                                    <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="input-field" placeholder="••••••" required />
                                </div>
                            </div>

                            {/* Conditional fields */}
                            {(role === 'DOCTOR' || role === 'RESIDENT') && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-navy mb-2">CRM</label>
                                        <input name="crm" type="text" value={formData.crm} onChange={handleChange} className="input-field" placeholder="CRM/UF 123456" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-navy mb-2">Especialidade</label>
                                        <select name="specialty" value={formData.specialty} onChange={handleChange} className="input-field" required>
                                            <option value="">Selecione...</option>
                                            {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </>
                            )}

                            {role === 'STUDENT' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-navy mb-2">Universidade</label>
                                        <input name="university" type="text" value={formData.university} onChange={handleChange} className="input-field" placeholder="Nome da universidade" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-navy mb-2">Semestre atual</label>
                                        <input name="semester" type="number" min="1" max="12" value={formData.semester} onChange={handleChange} className="input-field" placeholder="8" required />
                                    </div>
                                </>
                            )}

                            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                                {loading ? 'Criando conta...' : 'Criar Conta'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-gray">
                        Já tem conta?{' '}
                        <Link href="/login" className="text-teal font-semibold hover:underline">
                            Entrar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
