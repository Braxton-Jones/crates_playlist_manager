import redisClient from '@/lib/redis'
import Link from 'next/link'
interface DashboardSearchProps {
    access_token: string
    refresh_token: string | undefined
    expires_in: string
}
export default async function Dashboard({
    searchParams,
}: {
    searchParams: DashboardSearchProps
}) {
    const { access_token, refresh_token, expires_in } = searchParams
    if (!access_token || !refresh_token || !expires_in) {
        return (
            <main>
                <h2>Unauthorized</h2>
            </main>
        )
    }
    if (access_token && refresh_token && expires_in) {
        await redisClient.set('access_token', access_token)
        await redisClient.set('refresh_token', refresh_token)
        await redisClient.set('expires_in', expires_in)
    }
    {
        /* 
    - We need to make it so the user can't access the dashboard page without the access token, refresh token, and expires in
    - We need to make it so the user can't access the login page if they already have the access token, refresh token, and expires in  
    */
    }
    return (
        <main>
           
        </main>
    )
}
