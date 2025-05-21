import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from './app/lib/utils/constants/roles';

const protectedRoutes = ['/admin', '/thong-tin', '/thanh-toan', '/yeu-thich', '/don-hang-cua-toi'];
const authPages = ['/auth/dang-nhap', '/auth/dang-ki'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const ip = request.headers.get('x-forwarded-for') || request.ip;
  const currentUrl = request.nextUrl.pathname + request.nextUrl.search;

  console.log(`--------IP User: ${ip}`);

  if (token && authPages.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!token && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    const loginUrl = new URL('/auth/dang-nhap', request.url);
    loginUrl.searchParams.set('callbackUrl', currentUrl);

    return NextResponse.redirect(loginUrl);
  }
  if (token && token?.role === UserRole.CUSTOMER && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  // if (
  //   token &&
  //   token?.role === UserRole.ADMIN &&
  //   token?.role !== UserRole.STAFF &&
  //   token?.email !== process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN &&
  //   request.nextUrl.pathname.startsWith('/admin')
  // ) {
  //   return NextResponse.redirect(new URL('/unauthorized', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/thong-tin/:path*',
    '/thanh-toan/:path*',
    '/yeu-thich/:path*',
    '/auth/dang-nhap',
    '/auth/dang-ki'
  ]
};
