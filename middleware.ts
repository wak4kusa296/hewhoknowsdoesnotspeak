import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. ログインページ自体や、画像、システムファイルはチェックしない
  // (これを忘れると無限ループします)
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. 「通行手形(Cookie)」を持っているか確認
  const authCookie = request.cookies.get('auth');

  // 3. 持っていないなら、強制的にPlasmicで作ったログイン画面へ飛ばす
  if (authCookie?.value !== 'true') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. 持っているなら通す
  return NextResponse.next();
}

// どのページで発動するか（基本全ページ）
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
