import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const formData = await req.formData();
        const caseId = formData.get('caseId') as string;
        const files = formData.getAll('files') as File[];

        if (!caseId) {
            return NextResponse.json({ error: 'caseId é obrigatório' }, { status: 400 });
        }

        if (!files.length) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), 'uploads', caseId);
        await mkdir(uploadDir, { recursive: true });

        const documents = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const ext = path.extname(file.name);
            const filename = `${uuidv4()}${ext}`;
            const filepath = path.join(uploadDir, filename);

            await writeFile(filepath, buffer);

            const doc = await prisma.document.create({
                data: {
                    filename: file.name,
                    path: `/uploads/${caseId}/${filename}`,
                    mimetype: file.type,
                    caseId,
                },
            });

            documents.push(doc);
        }

        return NextResponse.json(documents, { status: 201 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 });
    }
}
