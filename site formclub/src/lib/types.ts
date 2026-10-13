export interface Modality {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'strength' | 'performance' | 'mobility' | 'all';
  categoryLabel: string;
  features: string[];
  idealFor: string;
  badge?: string;
  image: string;
}

export interface LeadFormData {
  fullName: string;
  whatsapp: string;
  goal: string;
  accessType: string;
  preferredShift: 'Manhã' | 'Tarde' | 'Noite';
  modalitySlug?: string;
  lgpdConsent: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface AmenityItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  iconName: string;
  image: string;
  span?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  rating: number;
  content: string;
  source: 'Google Reviews' | 'Wellhub Verified' | 'Membro FORMCLUB';
  date: string;
}
