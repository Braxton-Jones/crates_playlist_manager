import PlaylistSelector from '@/components/playlist-selector'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="flex h-screen items-center justify-center">
            <section className="app_container grid grid-cols-12 grid-rows-6 gap-2">
                <div className="col-span-4 row-span-1 flex items-center justify-center rounded-md bg-spotifyGreen px-5 uppercase">
                    <div className="text-6xl font-black tracking-widest">
                        Crates
                    </div>
                </div>
                <div className="col-span-4 col-start-1 row-span-5 row-start-2">
                    <PlaylistSelector />
                </div>
                <div className="col-span-9 col-start-5 row-span-6 row-start-1">
                    <section>{children}</section>
                </div>
            </section>
        </main>
    )
}
