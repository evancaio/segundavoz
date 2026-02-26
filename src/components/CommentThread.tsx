'use client';

import { useState } from 'react';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
        name: string;
        role: string;
    };
}

interface CommentThreadProps {
    comments: Comment[];
    caseId: string;
    canComment: boolean;
}

const roleLabels: Record<string, { label: string; color: string }> = {
    DOCTOR: { label: 'Médico', color: 'bg-mint/10 text-mint' },
    RESIDENT: { label: 'Residente', color: 'bg-warning/10 text-warning' },
    STUDENT: { label: 'Estudante', color: 'bg-teal/10 text-teal' },
};

export default function CommentThread({ comments, caseId, canComment }: CommentThreadProps) {
    const [newComment, setNewComment] = useState('');
    const [sending, setSending] = useState(false);
    const [localComments, setLocalComments] = useState<Comment[]>(comments);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSending(true);
        try {
            const res = await fetch(`/api/cases/${caseId}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment }),
            });

            if (res.ok) {
                const comment = await res.json();
                setLocalComments((prev) => [...prev, comment]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Comment error:', error);
        }
        setSending(false);
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-navy flex items-center gap-2">
                <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Discussão Interna
                <span className="text-xs text-gray font-normal">(visível apenas para médicos e estudantes)</span>
            </h3>

            {/* Comments list */}
            {localComments.length === 0 ? (
                <div className="text-center py-8 text-gray">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>Nenhum comentário ainda</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {localComments.map((comment) => {
                        const roleInfo = roleLabels[comment.author.role] || { label: comment.author.role, color: 'bg-gray/10 text-gray' };
                        return (
                            <div key={comment.id} className="p-4 bg-white rounded-xl border border-navy/5 animate-fade-in">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal to-mint flex items-center justify-center text-white text-sm font-bold">
                                        {comment.author.name.charAt(0)}
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-navy">{comment.author.name}</span>
                                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${roleInfo.color}`}>
                                            {roleInfo.label}
                                        </span>
                                    </div>
                                    <span className="ml-auto text-xs text-gray">
                                        {new Date(comment.createdAt).toLocaleString('pt-BR', {
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-dark leading-relaxed pl-10">{comment.content}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* New comment form */}
            {canComment && (
                <form onSubmit={handleSubmit} className="flex gap-3 mt-4">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escreva um comentário..."
                        className="input-field flex-1"
                    />
                    <button
                        type="submit"
                        disabled={sending || !newComment.trim()}
                        className="btn-primary !py-2 !px-5 disabled:opacity-50"
                    >
                        {sending ? '...' : 'Enviar'}
                    </button>
                </form>
            )}
        </div>
    );
}
