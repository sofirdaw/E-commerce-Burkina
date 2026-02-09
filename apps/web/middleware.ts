import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// SEULEMENT les routes publiques accessibles SANS connexion
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, etc.
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production'
    });

    // PROTECTION ADMIN
    if (pathname.startsWith('/admin') && pathname !== '/admin-login') {
      if (!token || token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin-login', request.url));
      }
    }

    // Redirect admin to dashboard if already logged in
    if (pathname === '/admin-login' && token && token.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // SI PAS DE TOKEN -> BLOQUER TOUT SAUF ROUTES PUBLIQUES
    if (!token) {
      // Vérifier si c'est une route publique exacte
      const isPublicRoute = publicRoutes.some(route => {
        if (route === '/') {
          return pathname === '/';
        }
        return pathname === route || pathname.startsWith(route);
      });

      if (!isPublicRoute) {
        // Rediriger vers login avec message
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        loginUrl.searchParams.set('message', 'Veuillez vous connecter pour accéder à cette page');
        return NextResponse.redirect(loginUrl);
      }

      // Si c'est une route publique, autoriser l'accès
      return NextResponse.next();
    }

    // SI TOKEN PRÉSENT -> VÉRIFICATIONS SPÉCIFIQUES
    
    // Rediriger les admins vers le panel admin s'ils essaient d'accéder aux routes client
    if (token.role === 'ADMIN') {
      if (pathname.startsWith('/client') || 
          pathname.startsWith('/products') || 
          pathname.startsWith('/categories') || 
          pathname.startsWith('/deals') ||
          pathname.startsWith('/cart') ||
          pathname.startsWith('/wishlist')) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }

    // Les clients connectés peuvent accéder à tout sauf admin
    return NextResponse.next();

  } catch (error) {
    console.error(`[Middleware] Error:`, error);
    // En cas d'erreur, rediriger vers login pour la sécurité
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
