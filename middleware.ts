import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import redisClient from './lib/redis'

export async function middleware(request: NextRequest) {
    const generateRandomString = (length: number) => {
        const possible =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const values = crypto.getRandomValues(new Uint8Array(length))
        return values.reduce(
            (acc, x) => acc + possible[x % possible.length],
            ''
        )
    }

    if (request.nextUrl.pathname === '/login') {
        const state = generateRandomString(16)
        const scope =
            'user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private playlist-read-private user-read-playback-state user-modify-playback-state user-library-read'
        return NextResponse.redirect(
            `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${scope}&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&state=${state}`
        )
    }
    if (request.nextUrl.pathname === '/callback') {
        const code = request.nextUrl.searchParams.get('code')
        const state = request.nextUrl.searchParams.get('state')
        const error = request.nextUrl.searchParams.get('error')
        const tokenURl = 'https://accounts.spotify.com/api/token'
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        }
        const body = new URLSearchParams({
            code: code || '',
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI || '',
            grant_type: 'authorization_code',
        })
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: body,
        }

        if (state === null || code === null) {
            return NextResponse.redirect(`/#error=state_mismatch`)
        }

        if (error) {
            console.error('Error in login', error)
            return NextResponse.redirect(`/#error=${error}`)
        }
        return fetch(tokenURl, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                const accessToken = data.access_token
                const refreshToken = data.refresh_token
                const expiresIn = data.expires_in
                {
                    /*
            TODO: Fix the redirect to the dashboard page, its using a hardcoded url
            */
                }
                return NextResponse.redirect(
                    `http://localhost:3000/dashboard?access_token=${accessToken}&refresh_token=${refreshToken}&expires_in=${expiresIn}`
                )
            })
            .catch((error) => {
                console.error('Error in callback:', error)
                return NextResponse.redirect('/#error=invalid_token')
            })
    }
    if (request.nextUrl.pathname === '/refresh_token') {
        const refreshToken = await redisClient.get('refresh_token')
        const authOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken as string,
            }),
        }
        // Get a new access token
        const response = await fetch(
            'https://accounts.spotify.com/api/token',
            authOptions
        )
        // Add the new access token to the request
        const data = await response.json()
        console.log(data, 'data from refresh_token endpoint')
        if (data.error) {
            return NextResponse.redirect('http://localhost:3000/')
        }

        return NextResponse.redirect(
            `http://localhost:3000/dashboard?access_token=${data.access_token}&refresh_token=${refreshToken}&expires_in=${data.expires_in}`
        )
    }
    return NextResponse.json({ message: 'Auth middleware default response' })
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/login', '/callback', '/refresh_token'],
}
