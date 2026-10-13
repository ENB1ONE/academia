import type { Metadata, Viewport } from 'next';
import { Syne, Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/ui/CookieConsent';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'FORMCLUB | Centro de Treinamento e Performance na Vila Galvão, Guarulhos',
  description:
    'Treine em alto padrão na Vila Galvão, Guarulhos. Equipamentos de alta tecnologia, Musculação, Treino Híbrido, Funcional, Core e Mobilidade com hora marcada. Aceitamos Wellhub Silver+.',
  keywords: [
    'FORMCLUB',
    'academia Vila Galvão',
    'centro de treinamento Guarulhos',
    'treino híbrido Guarulhos',
    'personal trainer Vila Galvão',
    'Wellhub Silver Guarulhos',
    'academia alto padrão Guarulhos',
    'condicionamento funcional Timóteo Penteado',
  ],
  authors: [{ name: 'FORMCLUB Performance' }],
  creator: 'FORMCLUB',
  metadataBase: new URL('https://formclub.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://formclub.com.br',
    siteName: 'FORMCLUB — Centro de Treinamento e Performance',
    title: 'FORMCLUB | Centro de Treinamento e Performance na Vila Galvão',
    description:
      'Treine com hora marcada, equipamentos de ponta e acompanhamento de elite na Vila Galvão, Guarulhos. Parceiro Wellhub Silver+.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'FORMCLUB — Centro de Treinamento e Performance na Vila Galvão',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FORMCLUB | Centro de Treinamento e Performance',
    description:
      'Onde a ciência da performance encontra a exclusividade de um clube. Vila Galvão, Guarulhos.',
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ExerciseGym',
  name: 'FORMCLUB - Centro de Treinamento e Performance',
  alternateName: 'FORMCLUB Vila Galvão',
  description:
    'Centro de Treinamento em Guarulhos (Vila Galvão) com equipamentos de alta tecnologia e metodologia voltada para evolução física, performance e qualidade de vida. Atendimento mediante agendamento.',
  url: 'https://formclub.com.br',
  sameAs: [
    'https://www.instagram.com/form.club/',
    'https://wellhub.com/pt-br/search/partners/formclub-vila-galvao/',
  ],
  telephone: '+55-11-98996-0961',
  priceRange: '$$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Avenida Doutor Timóteo Penteado, 3738 - 1º andar, Salas 7 e 8',
    addressLocality: 'Guarulhos',
    addressRegion: 'SP',
    postalCode: '07061-002',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -23.4542,
    longitude: -46.5492,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '22:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '08:00',
      closes: '13:00',
    },
  ],
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Área de pesos livres', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Área de treino funcional', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Mini bar', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Vestiário com chuveiros e itens de higiene pessoal', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Armários (Lockers)', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '72',
    bestRating: '5',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${syne.variable} ${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-obsidian text-alabaster min-h-screen flex flex-col selection:bg-bronze selection:text-obsidian antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <CookieConsent />
      </body>
    </html>
  );
}
