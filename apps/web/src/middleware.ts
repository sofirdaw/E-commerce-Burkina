export { default } from 'next-auth/middleware';

export const config = {
  // Protect account, checkout and category pages for unauthenticated users
  matcher: ['/account/:path*', '/checkout', '/categories/:path*', '/products', '/deals'],
};
