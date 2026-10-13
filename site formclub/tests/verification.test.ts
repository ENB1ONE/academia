import { generateWhatsAppLink, formatWhatsAppNumber, OFFICIAL_PHONE_CLEAN } from '../src/lib/utils';
import { checkRateLimit, hashIp, saveLead, getLeadsCount } from '../src/lib/leads-store';

console.log('🧪 Iniciando testes de validação do FORMCLUB...');

// Test 1: WhatsApp Link Generation
const waLink = generateWhatsAppLink({
  fullName: 'Eduardo Silveira',
  goal: 'Hipertrofia & Estética',
  accessType: 'Sou membro Wellhub Silver+',
  preferredShift: 'Manhã',
});

console.log('Test 1 - WhatsApp URL:', waLink);
if (
  waLink.includes(OFFICIAL_PHONE_CLEAN) &&
  waLink.includes(encodeURIComponent('Eduardo Silveira')) &&
  waLink.includes(encodeURIComponent('Hipertrofia & Estética'))
) {
  console.log('✅ Teste 1 APROVADO: Link do WhatsApp gerado com parametrização exata.');
} else {
  console.error('❌ Teste 1 FALHOU');
  process.exit(1);
}

// Test 2: Phone formatting
const formattedPhone = formatWhatsAppNumber('11989960961');
console.log('Test 2 - Phone formatted:', formattedPhone);
if (formattedPhone === '(11) 98996-0961') {
  console.log('✅ Teste 2 APROVADO: Máscara de telefone aplicada corretamente.');
} else {
  console.error('❌ Teste 2 FALHOU');
  process.exit(1);
}

// Test 3: Rate limiting & IP hashing
const testIp = '189.120.45.10';
const hashed = hashIp(testIp);
console.log('Test 3 - Hashed IP (SHA-256):', hashed);
if (hashed.length === 64 && hashed !== testIp) {
  console.log('✅ Teste 3 APROVADO: Anonimização de IP por SHA-256 conforme LGPD.');
} else {
  console.error('❌ Teste 3 FALHOU');
  process.exit(1);
}

// Test 4: Rate limit threshold
for (let i = 0; i < 5; i++) {
  checkRateLimit('192.168.1.1', 5, 60000);
}
const rateLimited = !checkRateLimit('192.168.1.1', 5, 60000);
if (rateLimited) {
  console.log('✅ Teste 4 APROVADO: Rate Limiter bloqueia após 5 requisições/minuto.');
} else {
  console.error('❌ Teste 4 FALHOU');
  process.exit(1);
}

// Test 5: Lead persistence
saveLead({
  fullName: 'Juliana Costa',
  whatsapp: '(11) 99876-5432',
  goal: 'Treino Híbrido',
  accessType: 'Quero conhecer os Planos FORMCLUB',
  preferredShift: 'Tarde',
  lgpdConsent: true,
  consentIpHash: hashed,
});

if (getLeadsCount() >= 1) {
  console.log('✅ Teste 5 APROVADO: Lead persistido com sucesso na base.');
} else {
  console.error('❌ Teste 5 FALHOU');
  process.exit(1);
}

console.log('🎉 Todos os 5 testes unitários e de integração passaram com 100% de sucesso!');
