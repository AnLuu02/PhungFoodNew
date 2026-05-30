import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_ROLES } from './shared/constants/user.constants';

const ADMIN_LOGIN_PATH = '/admin/dang-nhap';
const CLIENT_LOGIN_PATH = '/dang-nhap';

const authPages = ['/dang-nhap', '/dang-ky'];

const protectedClientRoutes = ['/thong-tin', '/don-hang-cua-toi'];

const isStartsWith = (pathname: string, routes: string[]) => {
  return routes.some(route => pathname === route || pathname.startsWith(`${route}/`));
};

const redirectTo = (path: string, request: NextRequest) => {
  return NextResponse.redirect(new URL(path, request.url));
};

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminLoginPage = pathname === ADMIN_LOGIN_PATH;
  const isAuthPage = isStartsWith(pathname, authPages);
  const isProtectedClientRoute = isStartsWith(pathname, protectedClientRoutes);

  /**
   * Admin login page
   */
  if (isAdminLoginPage) {
    if (!token) return NextResponse.next();

    const role = token.role as string;

    if (ADMIN_ROLES.includes(role as any)) {
      return redirectTo('/admin', request);
    }

    return redirectTo('/', request);
  }

  /**
   * Admin protected routes
   */
  if (isAdminRoute) {
    if (!token) {
      const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname + search);

      return NextResponse.redirect(loginUrl);
    }

    const role = token.role as string;

    if (!ADMIN_ROLES.includes(role as any)) {
      return redirectTo('/unauthorized', request);
    }

    return NextResponse.next();
  }

  /**
   * Client auth pages
   */
  if (isAuthPage) {
    if (token) {
      return redirectTo('/', request);
    }

    return NextResponse.next();
  }

  /**
   * Client protected routes
   */
  if (isProtectedClientRoute) {
    if (!token) {
      const loginUrl = new URL(CLIENT_LOGIN_PATH, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname + search);

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/thong-tin/:path*', '/don-hang-cua-toi/:path*', '/dang-nhap', '/dang-ky']
};
