'use client';

interface OpinionViewerProps {
    content: string;
    createdAt: string;
}

export default function OpinionViewer({ content, createdAt }: OpinionViewerProps) {
    return (
        <div className="bg-white rounded-2xl border border-navy/10 overflow-hidden shadow-lg">
            {/* Header */}
            <div className="bg-gradient-to-r from-navy to-navy-light p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Parecer Médico</h3>
                        <p className="text-white/60 text-sm">
                            Emitido em {new Date(createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8">
                <div
                    className="prose prose-navy max-w-none [&_h2]:text-navy [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-navy [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:text-gray-dark [&_p]:leading-relaxed [&_p]:mb-3 [&_strong]:text-navy [&_li]:text-gray-dark [&_li]:mb-1 [&_ul]:mb-4 [&_ol]:mb-4 [&_hr]:my-6 [&_hr]:border-navy/10 [&_em]:text-gray"
                    dangerouslySetInnerHTML={{
                        __html: content
                            .replace(/### (.*)/g, '<h3>$1</h3>')
                            .replace(/## (.*)/g, '<h2>$1</h2>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/^- (.*)/gm, '<li>$1</li>')
                            .replace(/^\d+\. (.*)/gm, '<li>$1</li>')
                            .replace(/---/g, '<hr/>')
                            .replace(/\n\n/g, '<br/><br/>'),
                    }}
                />
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-offwhite border-t border-navy/5 flex items-center justify-between">
                <p className="text-xs text-gray">
                    Este documento é confidencial e de uso exclusivo do paciente.
                </p>
                <div className="flex items-center gap-2 text-mint text-sm font-semibold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Verificado
                </div>
            </div>
        </div>
    );
}
