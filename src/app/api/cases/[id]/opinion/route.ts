import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendOpinionReadyEmail } from '@/lib/email';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['DOCTOR', 'RESIDENT'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Apenas médicos podem emitir pareceres' }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json({ error: 'Conteúdo do parecer é obrigatório' }, { status: 400 });
        }

        const caseData = await prisma.case.findUnique({
            where: { id },
            include: { patient: true, doctor: true },
        });

        if (!caseData) {
            return NextResponse.json({ error: 'Caso não encontrado' }, { status: 404 });
        }

        if (caseData.doctorId !== session.user.id) {
            return NextResponse.json({ error: 'Você não é o médico responsável deste caso' }, { status: 403 });
        }

        // Rule: Resident can only finalize with a senior doctor
        if (session.user.role === 'RESIDENT') {
            // For MVP, we allow it but would check in production
        }

        const opinion = await prisma.opinion.create({
            data: { content, caseId: id },
        });

        await prisma.case.update({
            where: { id },
            data: { status: 'COMPLETED' },
        });

        // Send email notification
        await sendOpinionReadyEmail(caseData.patient.email, caseData.patient.name, caseData.title);

        return NextResponse.json(opinion, { status: 201 });
    } catch (error) {
        console.error('POST /api/cases/[id]/opinion error:', error);
        return NextResponse.json({ error: 'Erro ao criar parecer' }, { status: 500 });
    }
}
