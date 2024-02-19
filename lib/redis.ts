import { Redis } from '@upstash/redis'

const redisClient = new Redis({
    url: 'https://us1-live-alien-41252.upstash.io',
    token: 'AaEkASQgMGM3MTNiZGItMmVmZS00OGJmLWE1YzQtYjcwNjZmZTA5YjNlOGZmZmEyMTVmMzRmNDgyYTg3OTc2M2QwZGNkZGUzODg=',
})

export default redisClient
