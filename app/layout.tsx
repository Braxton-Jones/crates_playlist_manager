import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Nunito_Sans, Syne } from 'next/font/google'

export const metadata: Metadata = {
    title: 'Crates - Spotify Playlist Organizer + Generator',
    description: 'Organize songs into Spotify playlists with ease.',
}

const nunito_sans = Nunito_Sans({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
})

const syne = Syne({
    weight: ['600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning={true}
            className={`${syne.className}`}
        >
            <body className="box-border w-full">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
