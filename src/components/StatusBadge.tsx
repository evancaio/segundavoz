'use client';

interface StatusBadgeProps {
    status: string;
    size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
    PENDING: {
        label: 'Pendente',
        color: 'bg-warning/10 text-warning border-warning/20',
        dot: 'bg-warning',
    },
    IN_REVIEW: {
        label: 'Em Análise',
        color: 'bg-teal/10 text-teal border-teal/20',
        dot: 'bg-teal',
    },
    COMPLETED: {
        label: 'Concluído',
        color: 'bg-mint/10 text-mint border-mint/20',
        dot: 'bg-mint',
    },
    CANCELLED: {
        label: 'Cancelado',
        color: 'bg-danger/10 text-danger border-danger/20',
        dot: 'bg-danger',
    },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.PENDING;

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-3 py-1',
        lg: 'text-sm px-4 py-1.5',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${config.color} ${sizeClasses[size]}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
            {config.label}
        </span>
    );
}
