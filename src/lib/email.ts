// Mock email service using Nodemailer
// In production, configure with real SMTP credentials

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
    console.log('=== MOCK EMAIL SENT ===');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body: ${options.html.substring(0, 200)}...`);
    console.log('========================');
}

export async function sendOpinionReadyEmail(
    patientEmail: string,
    patientName: string,
    caseTitle: string
): Promise<void> {
    await sendEmail({
        to: patientEmail,
        subject: `SegundaVoz - Parecer disponível: ${caseTitle}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #021C3E;">Seu parecer está pronto!</h2>
        <p>Olá, <strong>${patientName}</strong>!</p>
        <p>O parecer médico para o caso <strong>"${caseTitle}"</strong> já está disponível na plataforma.</p>
        <a href="http://localhost:3000/dashboard" 
           style="display: inline-block; background: #028090; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          Ver Parecer
        </a>
        <p style="color: #64748B; margin-top: 24px; font-size: 14px;">
          Equipe SegundaVoz
        </p>
      </div>
    `,
    });
}
