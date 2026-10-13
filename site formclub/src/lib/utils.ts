import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const OFFICIAL_PHONE = '+55 11 98996-0961';
export const OFFICIAL_PHONE_CLEAN = '5511989960961';
export const OFFICIAL_INSTAGRAM = 'https://www.instagram.com/form.club/';
export const OFFICIAL_WELLHUB = 'https://wellhub.com/pt-br/search/partners/formclub-vila-galvao/';
export const OFFICIAL_ADDRESS = 'Av. Dr. Timóteo Penteado, 3738 - 1º andar (Salas 7 e 8) - Vila Galvão, Guarulhos - SP, CEP 07061-002';
export const GOOGLE_MAPS_URL = 'https://maps.google.com/?q=Av.+Dr.+Tim%C3%B3teo+Penteado,+3738+-+Vila+Galv%C3%A3o,+Guarulhos+-+SP,+07061-002';
export const WAZE_URL = 'https://waze.com/ul?q=Av.+Dr.+Timoteo+Penteado+3738+Vila+Galvao+Guarulhos';

export function generateWhatsAppLink(params: {
  fullName?: string;
  goal?: string;
  accessType?: string;
  preferredShift?: string;
  customMessage?: string;
}): string {
  if (params.customMessage) {
    return `https://wa.me/${OFFICIAL_PHONE_CLEAN}?text=${encodeURIComponent(params.customMessage)}`;
  }

  const name = params.fullName ? params.fullName.trim() : 'Visitante';
  const goal = params.goal || 'Performance & Evolução Física';
  const access = params.accessType || 'Conhecer os Planos FORMCLUB';
  const shift = params.preferredShift || 'Manhã';

  const text = `Olá, equipe FORMCLUB! Vim pelo site oficial. Meu nome é ${name}, meu objetivo principal é ${goal} (${access}) e gostaria de agendar uma sessão no período da ${shift}.`;

  return `https://wa.me/${OFFICIAL_PHONE_CLEAN}?text=${encodeURIComponent(text)}`;
}

export function formatWhatsAppNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
