import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ErrorBoundary } from '@/components/error-boundary';
import { AnalyticsTracker } from '@/components/analytics/tracker';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Ecomm-Burkina | Votre Marketplace Premium',
    template: '%s | Ecomm-Burkina',
  },
  description:
    'La plateforme e-commerce premium du Burkina Faso. Découvrez des milliers de produits, livraison rapide, paiement Orange Money.',
  keywords: [
    'e-commerce',
    'Burkina Faso',
    'shopping',
    'Orange Money',
    'marketplace',
    'Ouagadougou',
  ],
  authors: [{ name: 'August' }],
  creator: 'August',
  openGraph: {
    type: 'website',
    locale: 'fr_BF',
    url: 'https://ecomm-burkina.com',
    siteName: 'Ecomm-Burkina',
    title: 'Ecomm-Burkina | Votre Marketplace Premium',
    description:
      'La plateforme e-commerce premium du Burkina Faso. Découvrez des milliers de produits.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ecomm-Burkina',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecomm-Burkina | Votre Marketplace Premium',
    description:
      'La plateforme e-commerce premium du Burkina Faso.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session;

    return (
      <html lang="fr" suppressHydrationWarning>
        <body className={inter.variable}>
          <Providers session={session}>
            <ErrorBoundary>
              <AnalyticsTracker />
              <div>
                <Header />
                <main>{children}</main>
                <Footer />
              </div>
            </ErrorBoundary>
          </Providers>
        </body>
      </html>
    );
  } catch (error) {
    // Fallback en cas d'erreur avec les composants
    return (
      <html lang="fr" suppressHydrationWarning>
        <body className={inter.variable}>
          <div>
            <main>{children}</main>
          </div>
        </body>
      </html>
    );
  }
}
