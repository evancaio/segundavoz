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
        if (!session || !['DOCTOR', 'RESIDENT', 'STUDENT'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json({ error: 'Conteúdo do comentário é obrigatório' }, { status: 400 });
        }

        const caseData = await prisma.case.findUnique({ where: { id } });
        if (!caseData) {
            return NextResponse.json({ error: 'Caso não encontrado' }, { status: 404 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                authorId: session.user.id,
                caseId: id,
            },
            include: { author: { select: { name: true, role: true } } },
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error('POST /api/cases/[id]/comment error:', error);
        return NextResponse.json({ error: 'Erro ao criar comentário' }, { status: 500 });
    }
}
