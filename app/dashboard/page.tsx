import redisClient from '@/lib/redis'
import { Suspense } from 'react'
interface DashboardSearchProps {
    access_token: string
    refresh_token: string | undefined
    expires_in: string
}

export async function getLikedTracks() {
    // Define the array to store the liked tracks
    const likedTracks: any[] = []
    try {
        const fetchLikedTracks = async (url: string): Promise<void> => {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${await redisClient.get('access_token')}`,
                }
            },)
            const data = await res.json()
            likedTracks.push(...data.items)

            if(data.next) {
                await fetchLikedTracks(data.next)
            }

            if (data?.error?.message === 'The access token expired') {
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

                const response = await fetch('https://accounts.spotify.com/api/token', authOptions)
                const data = await response.json()
                if (data.error) {
                    throw new Error('Error fetching liked tracks, trying to refresh token')
                }
                await redisClient.set('access_token', data.access_token)
                return fetchLikedTracks(url)
            }

        }
        await fetchLikedTracks('https://api.spotify.com/v1/me/tracks?limit=50')
        return likedTracks
    } catch (error) {
        console.error('Error fetching liked tracks:', error)
        throw error
    
    }
}

export default async function Dashboard({
    searchParams,
}: {
    searchParams: DashboardSearchProps
}) {
    const { access_token, refresh_token, expires_in } = searchParams
    if (access_token && refresh_token && expires_in) {
        try {
            await redisClient.set('access_token', access_token)
            await redisClient.set('refresh_token', refresh_token)
            await redisClient.set('expires_in', expires_in)
        } catch (error) {
            console.error(
                'Error setting tokens in Redis and or issue with getting params:',
                error
            )
        }
    }
    const likedTracks = await getLikedTracks()
    console.log(likedTracks, 'likedTracks')
    

    const params = new URLSearchParams(searchParams as any)
    console.log(params, 'params')

    return (
        <main>
            <div className="grid grid-cols-6 grid-rows-6 gap-4">
                <div className="col-start-1 row-span-5 row-start-2">1</div>
                <div className="col-span-5 col-start-2 row-span-5 row-start-2">
                    2
                </div>
                <div className="col-span-6 col-start-1 row-start-1">3</div>
            </div>
        </main>
    )
}
