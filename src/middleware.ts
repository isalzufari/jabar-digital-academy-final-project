export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/posts/:path*',
    '/api/comments/:path*',
    '/api/likes/:path*',
  ],
};
