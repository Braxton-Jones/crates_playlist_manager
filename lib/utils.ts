import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function decodeHTMLEntities(text: string) {
    let entities = [
        ['amp', '&'],
        ['apos', "'"],
        ['lt', '<'],
        ['gt', '>'],
        ['#39', "'"],
        ['#x27', "'"],
        ['#039', "'"],
    ]

    for (let entity of entities) {
        let regex = new RegExp('&' + entity[0] + ';', 'g')
        text = text.replace(regex, entity[1])
    }

    return text
}
