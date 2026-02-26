import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    await prisma.comment.deleteMany();
    await prisma.opinion.deleteMany();
    await prisma.document.deleteMany();
    await prisma.case.deleteMany();
    await prisma.user.deleteMany();

    const password = await bcrypt.hash('123456', 10);

    const admin = await prisma.user.create({
        data: { name: 'Admin Sistema', email: 'admin@segundavoz.com', password, role: 'ADMIN' },
    });

    const cardio = await prisma.user.create({
        data: { name: 'Dra. Ana Carvalho', email: 'ana@segundavoz.com', password, role: 'DOCTOR', crm: 'CRM/SP 123456', specialty: 'Cardiologia' },
    });

    const neuro = await prisma.user.create({
        data: { name: 'Dr. Carlos Mendes', email: 'carlos@segundavoz.com', password, role: 'DOCTOR', crm: 'CRM/RJ 654321', specialty: 'Neurologia' },
    });

    const resident = await prisma.user.create({
        data: { name: 'Dr. Pedro Silva', email: 'pedro@segundavoz.com', password, role: 'RESIDENT', crm: 'CRM/MG 789012', specialty: 'Cardiologia' },
    });

    const student1 = await prisma.user.create({
        data: { name: 'Maria Estudante', email: 'maria@segundavoz.com', password, role: 'STUDENT', university: 'USP', semester: 8 },
    });

    const student2 = await prisma.user.create({
        data: { name: 'João Estudante', email: 'joao@segundavoz.com', password, role: 'STUDENT', university: 'UNIFESP', semester: 10 },
    });

    const patient = await prisma.user.create({
        data: { name: 'Roberto Paciente', email: 'roberto@email.com', password, role: 'PATIENT' },
    });

    await prisma.case.create({
        data: { title: 'Dor torácica recorrente', description: 'Paciente relata dor no peito ao esforço há 3 meses. ECG normal.', specialty: 'Cardiologia', status: 'PENDING', isPaid: false, patientId: patient.id },
    });

    const case2 = await prisma.case.create({
        data: { title: 'Cefaleia crônica com aura', description: 'Enxaqueca com aura visual há 6 meses. RM de crânio sem alterações.', specialty: 'Neurologia', status: 'IN_REVIEW', isPaid: true, amount: 40, patientId: patient.id, doctorId: neuro.id, deadline: new Date(Date.now() + 48 * 60 * 60 * 1000) },
    });

    const case3 = await prisma.case.create({
        data: { title: 'Arritmia detectada em Holter', description: 'Holter 24h detectou extrassístoles ventriculares frequentes.', specialty: 'Cardiologia', status: 'COMPLETED', isPaid: true, amount: 40, patientId: patient.id, doctorId: cardio.id, deadline: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    await prisma.opinion.create({
        data: {
            content: '## Parecer Médico\n\nAs extrassístoles ventriculares detectadas são consideradas benignas no contexto de coração estruturalmente normal.\n\n### Recomendações\n- Evitar excesso de cafeína\n- Atividade física regular\n- Acompanhamento semestral\n\n*Dra. Ana Carvalho — CRM/SP 123456*',
            caseId: case3.id,
        },
    });

    await prisma.comment.create({ data: { content: 'Sugiro solicitar angiotomografia.', authorId: student1.id, caseId: case2.id } });
    await prisma.comment.create({ data: { content: 'Boa observação. Considerar perfil hormonal.', authorId: resident.id, caseId: case2.id } });

    console.log('Seed OK! Senha: 123456');
}

main().catch(console.error).finally(() => prisma.$disconnect());
