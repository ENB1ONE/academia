import crypto from 'crypto';

export interface StoredLead {
  id: string;
  fullName: string;
  whatsapp: string;
  goal: string;
  accessType: string;
  preferredShift: string;
  modalitySlug?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  lgpdConsent: boolean;
  consentIpHash: string;
  status: 'PENDING_WHATSAPP' | 'CONTACTED' | 'SCHEDULED' | 'ATTENDED';
  createdAt: string;
}

// In-memory persistent structure during runtime; scalable to database/Prisma
const leadsDatabase: StoredLead[] = [];

// Rate limiting in-memory bucket: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();

export function hashIp(ip: string): string {
  const salt = process.env.LGPD_SALT || 'formclub_secret_salt_2026';
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
}

export function checkRateLimit(ip: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((time) => now - time < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

export function saveLead(data: Omit<StoredLead, 'id' | 'status' | 'createdAt'>): StoredLead {
  const newLead: StoredLead = {
    ...data,
    id: crypto.randomUUID(),
    status: 'PENDING_WHATSAPP',
    createdAt: new Date().toISOString(),
  };

  leadsDatabase.unshift(newLead);
  // Keep last 1000 in memory
  if (leadsDatabase.length > 1000) {
    leadsDatabase.pop();
  }

  return newLead;
}

export function getLeadsCount(): number {
  return leadsDatabase.length;
}
