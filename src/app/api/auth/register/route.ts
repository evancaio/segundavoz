import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password, role, crm, specialty, university, semester } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Nome, email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email já cadastrado' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'PATIENT',
                crm,
                specialty,
                university,
                semester: semester ? parseInt(semester) : undefined,
            },
        });

        return NextResponse.json(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            { status: 201 }
        );
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
    }
}
