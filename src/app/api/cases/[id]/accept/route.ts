import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['DOCTOR', 'RESIDENT'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Apenas médicos podem aceitar casos' }, { status: 403 });
        }

        const { id } = await params;
        const caseData = await prisma.case.findUnique({ where: { id } });

        if (!caseData) {
            return NextResponse.json({ error: 'Caso não encontrado' }, { status: 404 });
        }

        if (caseData.doctorId) {
            return NextResponse.json({ error: 'Caso já aceito por outro médico' }, { status: 400 });
        }

        const updated = await prisma.case.update({
            where: { id },
            data: {
                doctorId: session.user.id,
                status: 'IN_REVIEW',
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('POST /api/cases/[id]/accept error:', error);
        return NextResponse.json({ error: 'Erro ao aceitar caso' }, { status: 500 });
    }
}
