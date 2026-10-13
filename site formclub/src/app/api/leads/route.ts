import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateWhatsAppLink } from '@/lib/utils';
import { checkRateLimit, hashIp, saveLead } from '@/lib/leads-store';

// Strict Zod schema for Lead Booking
const leadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: 'Por favor, informe seu nome completo (mínimo 3 caracteres).' })
    .max(120, { message: 'Nome muito longo (máximo 120 caracteres).' })
    .refine((val) => !/<[^>]*>/g.test(val), { message: 'Caracteres inválidos detectados.' }),
  whatsapp: z
    .string()
    .trim()
    .min(10, { message: 'Informe seu WhatsApp com DDD completo.' })
    .max(20, { message: 'Número de WhatsApp inválido.' })
    .refine((val) => {
      const digits = val.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 11;
    }, { message: 'Formato de WhatsApp inválido. Digite DDD + número (ex: 11 98996-0961).' }),
  goal: z
    .string()
    .trim()
    .min(2, { message: 'Selecione seu objetivo principal.' })
    .max(80),
  accessType: z
    .string()
    .trim()
    .min(2, { message: 'Selecione o tipo de acesso desejado.' })
    .max(80),
  preferredShift: z.enum(['Manhã', 'Tarde', 'Noite'], {
    errorMap: () => ({ message: 'Selecione o turno preferido (Manhã, Tarde ou Noite).' }),
  }),
  modalitySlug: z.string().optional(),
  lgpdConsent: z.literal(true, {
    errorMap: () => ({ message: 'É obrigatório concordar com o tratamento de dados para agendamento (LGPD).' }),
  }),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Identify client IP for NetSecOps & Rate Limiting
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = (forwardedFor ? forwardedFor.split(',')[0].trim() : realIp) || '127.0.0.1';

    // 2. Check Rate Limit (5 requests per minute per IP)
    const isAllowed = checkRateLimit(clientIp, 5, 60000);
    if (!isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Muitas tentativas em pouco tempo. Por favor, aguarde um minuto ou fale diretamente no WhatsApp.',
        },
        { status: 429 }
      );
    }

    // 3. Parse JSON Body
    const body = await req.json();

    // 4. Validate with Zod
    const validationResult = leadSchema.safeParse(body);
    if (!validationResult.error && !validationResult.data) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos.' },
        { status: 400 }
      );
    }

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || 'Verifique os dados informados.';
      return NextResponse.json(
        {
          success: false,
          error: firstError,
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // 5. Hash IP for LGPD compliance record without storing raw personal data
    const consentIpHash = hashIp(clientIp);

    // 6. Save Lead Record
    const savedLead = saveLead({
      fullName: validData.fullName,
      whatsapp: validData.whatsapp,
      goal: validData.goal,
      accessType: validData.accessType,
      preferredShift: validData.preferredShift,
      modalitySlug: validData.modalitySlug,
      utmSource: validData.utmSource,
      utmMedium: validData.utmMedium,
      utmCampaign: validData.utmCampaign,
      lgpdConsent: validData.lgpdConsent,
      consentIpHash,
    });

    // 7. Generate official WhatsApp URL
    const whatsappUrl = generateWhatsAppLink({
      fullName: validData.fullName,
      goal: validData.goal,
      accessType: validData.accessType,
      preferredShift: validData.preferredShift,
    });

    return NextResponse.json({
      success: true,
      message: 'Pré-agendamento registrado com sucesso!',
      leadId: savedLead.id,
      whatsappUrl,
    });
  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Ocorreu um erro interno ao processar seu agendamento. Tente novamente ou use o WhatsApp direto.',
      },
      { status: 500 }
    );
  }
}
