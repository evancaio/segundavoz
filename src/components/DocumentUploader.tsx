'use client';

import { useState, useCallback } from 'react';

interface DocumentUploaderProps {
    caseId?: string;
    onUploadComplete?: (documents: any[]) => void;
}

export default function DocumentUploader({ caseId, onUploadComplete }: DocumentUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles((prev) => [...prev, ...droppedFiles]);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (!caseId || !files.length) return;
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('caseId', caseId);
            files.forEach((file) => formData.append('files', file));

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const docs = await res.json();
                setUploadedDocs(docs);
                setFiles([]);
                onUploadComplete?.(docs);
            }
        } catch (error) {
            console.error('Upload error:', error);
        }

        setUploading(false);
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = (mime: string) => {
        if (mime.startsWith('image/')) return '🖼️';
        if (mime === 'application/pdf') return '📄';
        if (mime.includes('word') || mime.includes('document')) return '📝';
        return '📎';
    };

    return (
        <div className="space-y-4">
            {/* Drop zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
          ${dragOver
                        ? 'border-teal bg-teal/5 scale-[1.01]'
                        : 'border-gray-light/50 hover:border-teal/50 hover:bg-teal/3'
                    }`}
            >
                <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.dicom"
                />
                <div className="space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-teal/10 flex items-center justify-center">
                        <svg className="w-7 h-7 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-navy font-semibold">Arraste arquivos aqui</p>
                        <p className="text-sm text-gray mt-1">ou clique para selecionar</p>
                        <p className="text-xs text-gray-light mt-2">PDF, imagens, documentos — até 10MB por arquivo</p>
                    </div>
                </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-navy">Arquivos selecionados ({files.length})</p>
                    {files.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-navy/5">
                            <span className="text-xl">{getFileIcon(file.type)}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-navy truncate">{file.name}</p>
                                <p className="text-xs text-gray">{formatSize(file.size)}</p>
                            </div>
                            <button
                                onClick={() => removeFile(i)}
                                className="p-1 hover:bg-danger/10 rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}

                    {caseId && (
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="btn-primary w-full mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Enviando...
                                </span>
                            ) : (
                                `Enviar ${files.length} arquivo${files.length > 1 ? 's' : ''}`
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Uploaded files */}
            {uploadedDocs.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-mint flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Enviados com sucesso
                    </p>
                    {uploadedDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-2 p-2 bg-mint/5 rounded-lg text-sm text-navy">
                            <span>📄</span>
                            <span className="truncate">{doc.filename}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
