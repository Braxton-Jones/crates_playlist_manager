import redisClient from '@/lib/redis'
import Image from 'next/image'
import { decodeHTMLEntities } from '@/lib/utils'

async function getPlaylists(access_token: string) {
    try {
        // Update for people with more than 50 playlists
        const response = await fetch(
            'https://api.spotify.com/v1/me/playlists?limit=50',
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        )
        const data = await response.json()
        if (data && data?.error?.message === 'The access token expired') {
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
            if (data.error) {
                throw new Error('Error fetching playlists')
            }
            await redisClient.set('access_token', data.access_token)
            return getPlaylists(data.access_token)
        }
        return data
    } catch (error) {
        console.error('Error fetching playlists:', error)

        throw error
    }
}
export default async function PlaylistSelector() {
    const playlists = await getPlaylists(
        (await redisClient.get('access_token')) as string
    )

    return (
        <section className="playlist-selector flex h-full flex-col gap-3 overflow-y-scroll rounded-lg bg-playlistBackground p-5">
            {playlists &&
                playlists.items.map((playlist: any) => {
                    return (
                        <div className="flex items-center gap-2 rounded-md bg-playlistForeground hover:cursor-pointer hover:brightness-75">
                            <div
                                style={{
                                    backgroundImage: `url(${playlist.images[0].url})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minWidth: '55px',
                                    minHeight: '55px',
                                    borderRadius: '10%',
                                }}
                            />
                            <div>
                                <h3>{playlist.name}</h3>
                                <p className="playlist-body text-xs">
                                    {playlist.description
                                        ? decodeHTMLEntities(
                                              playlist.description
                                          )
                                        : 'no description available for this playlist'}
                                </p>
                            </div>
                        </div>
                    )
                })}
        </section>
    )
}
