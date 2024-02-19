'use client'
import { decodeHTMLEntities } from '../lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
export default function PlaylistList(playlists: Record<string, any>) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const url = `${pathname}?${searchParams}`

    const addPlaylistToEditorList = (
        playlistID: string,
        playlistName: string
    ) => {
        // Clear current search params (access_token, refresh_token, expires_in)
        const currentSearchParams = new URLSearchParams(window.location.search)
        currentSearchParams.delete('access_token')
        currentSearchParams.delete('refresh_token')
        currentSearchParams.delete('expires_in')

        // Check if playlistName already exists in search params
        if (!currentSearchParams.has(playlistName)) {
            currentSearchParams.append(playlistName, playlistID)
        } else {
            // If playlistName already exists, update its value
            currentSearchParams.delete(playlistName, playlistID)
        }

        // Construct the new URL with updated search params
        const newSearchParamsString = currentSearchParams.toString()
        const newUrl =
            '/dashboard' +
            (newSearchParamsString ? `?${newSearchParamsString}` : '')

        // Use React Router to push the new URL
        router.push(newUrl)
    }

    return (
        <>
            {playlists &&
                playlists.playlists.map((playlist: any) => {
                    return (
                        <div
                            key={playlist.id}
                            className="flex items-center gap-2 rounded-md bg-playlistForeground hover:cursor-pointer hover:brightness-75"
                            onClick={() =>
                                addPlaylistToEditorList(
                                    playlist.id,
                                    playlist.name
                                )
                            }
                        >
                            <div
                                style={{
                                    backgroundImage: `url(${playlist.images[0]?.url})`,
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
        </>
    )
}
