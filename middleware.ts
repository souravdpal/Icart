import { NextResponse,type NextRequest } from "next/server";
import { SetNewSessionCookie } from "./lib/cookies/cookies_setup";

export async function middleware(request:NextRequest){
    const sessionId = request.cookies.get("sessionId")?.value
    const refreshToken = request.cookies.get("refreshToken")?.value

    const {pathname} = request.nextUrl

    if(!refreshToken){
        const loginurl = new URL('/login',request.url)
        loginurl.searchParams.set('form',pathname)
        return NextResponse.redirect(loginurl)

    }
    return NextResponse.next()
}

export const config = {
    matcher : [
     '/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)',
    ]
}