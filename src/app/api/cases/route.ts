import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const { role, id, specialty } = session.user;
        let cases;

        if (role === 'PATIENT') {
            cases = await prisma.case.findMany({
                where: { patientId: id },
                include: { documents: true, opinion: true, doctor: { select: { name: true, specialty: true } } },
                orderBy: { createdAt: 'desc' },
            });
        } else if (role === 'DOCTOR' || role === 'RESIDENT') {
            const { searchParams } = new URL(req.url);
            const filter = searchParams.get('filter');

            if (filter === 'available') {
                cases = await prisma.case.findMany({
                    where: {
                        status: 'PENDING',
                        doctorId: null,
                        ...(specialty ? { OR: [{ specialty }, { specialty: '' }] } : {}),
                    },
                    include: { documents: true, patient: { select: { name: true } } },
                    orderBy: { createdAt: 'desc' },
                });
            } else {
                cases = await prisma.case.findMany({
                    where: { doctorId: id },
                    include: { documents: true, opinion: true, patient: { select: { name: true } }, comments: { include: { author: { select: { name: true, role: true } } } } },
                    orderBy: { createdAt: 'desc' },
                });
            }
        } else if (role === 'STUDENT') {
            cases = await prisma.case.findMany({
                where: { status: { in: ['PENDING', 'IN_REVIEW'] } },
                include: { documents: true, comments: { include: { author: { select: { name: true, role: true } } } } },
                orderBy: { createdAt: 'desc' },
            });
            // Anonymize patient data
            cases = cases.map((c: any) => ({ ...c, patientId: 'anonymous', patient: { name: 'Paciente Anônimo' } }));
        } else if (role === 'ADMIN') {
            cases = await prisma.case.findMany({
                include: { documents: true, opinion: true, patient: { select: { name: true, email: true } }, doctor: { select: { name: true, specialty: true } }, comments: true },
                orderBy: { createdAt: 'desc' },
            });
        } else {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        return NextResponse.json(cases);
    } catch (error) {
        console.error('GET /api/cases error:', error);
        return NextResponse.json({ error: 'Erro ao buscar casos' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'PATIENT') {
            return NextResponse.json({ error: 'Apenas pacientes podem criar casos' }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, specialty, isPaid, documentIds } = body;

        if (!title || !description || !specialty) {
            return NextResponse.json({ error: 'Título, descrição e especialidade são obrigatórios' }, { status: 400 });
        }

        const newCase = await prisma.case.create({
            data: {
                title,
                description,
                specialty,
                isPaid: isPaid || false,
                amount: isPaid ? 40 : 0,
                patientId: session.user.id,
                deadline: isPaid ? new Date(Date.now() + 48 * 60 * 60 * 1000) : null,
                ...(documentIds?.length ? { documents: { connect: documentIds.map((id: string) => ({ id })) } } : {}),
            },
            include: { documents: true },
        });

        return NextResponse.json(newCase, { status: 201 });
    } catch (error) {
        console.error('POST /api/cases error:', error);
        return NextResponse.json({ error: 'Erro ao criar caso' }, { status: 500 });
    }
}
