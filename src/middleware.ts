import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export const config = {matcher: ['/','/dashboard/:path*','/verify/:path*','/signin','/signup'] }
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl
  if(token && (
    url.pathname === '/' ||
    url.pathname === '/verify' ||
    url.pathname === '/signin' ||
    url.pathname === '/signup'
  )){
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if(!token && url.pathname.startsWith('/dashboard')){
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  return NextResponse.next()
}
 

