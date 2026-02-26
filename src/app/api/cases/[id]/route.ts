import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const { id } = await params;
        const caseData = await prisma.case.findUnique({
            where: { id },
            include: {
                documents: true,
                opinion: true,
                patient: { select: { id: true, name: true, email: true } },
                doctor: { select: { id: true, name: true, specialty: true } },
                comments: {
                    include: { author: { select: { name: true, role: true } } },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!caseData) {
            return NextResponse.json({ error: 'Caso não encontrado' }, { status: 404 });
        }

        const { role, id: userId } = session.user;

        // Patients can only see their own cases
        if (role === 'PATIENT' && caseData.patientId !== userId) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        // Filter out comments for patients
        if (role === 'PATIENT') {
            caseData.comments = [];
        }

        // Anonymize for students
        if (role === 'STUDENT') {
            (caseData as any).patient = { id: 'anonymous', name: 'Paciente Anônimo', email: '' };
            (caseData as any).patientId = 'anonymous';
        }

        return NextResponse.json(caseData);
    } catch (error) {
        console.error('GET /api/cases/[id] error:', error);
        return NextResponse.json({ error: 'Erro ao buscar caso' }, { status: 500 });
    }
}
