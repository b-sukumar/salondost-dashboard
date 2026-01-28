import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SB_URL!,
        process.env.NEXT_PUBLIC_SB_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // const { data: { user } } = await supabase.auth.getUser()

    // Protect routes. Redirect to /login if not authenticated.
    // Allow /login and /auth routes.
    // const isLoginPage = request.nextUrl.pathname.startsWith('/login')
    // const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
    // const isStaticFile = request.nextUrl.pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)

    // if (!user && !isLoginPage && !isAuthPage && !isStaticFile) {
    //     return NextResponse.redirect(new URL('/login', request.url))
    // }

    // Redirect to / if user is logged in but tries to access /login
    // if (user && isLoginPage) {
    //     return NextResponse.redirect(new URL('/', request.url))
    // }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
