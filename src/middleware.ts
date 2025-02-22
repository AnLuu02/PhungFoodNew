import { UserRole } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/admin', '/thong-tin', '/thanh-toan', '/yeu-thich', '/don-hang-cua-toi'];
const authPages = ['/dang-nhap', '/dang-ki'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const currentUrl = request.nextUrl.pathname + request.nextUrl.search;

  if (token && authPages.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!token && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    const loginUrl = new URL('/dang-nhap', request.url);
    loginUrl.searchParams.set('callbackUrl', currentUrl);

    return NextResponse.redirect(loginUrl);
  }

  if (token && token?.role !== UserRole.ADMIN && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/thong-tin/:path*', '/thanh-toan/:path*', '/yeu-thich/:path*', '/dang-nhap', '/dang-ki']
};
