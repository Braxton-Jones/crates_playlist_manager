'use client'
import React from 'react'
import { useTheme } from 'next-themes'
export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    return (
        <>
            <h1>Current theme: {theme}</h1>
            <button onClick={() => setTheme('light')}>Light</button>
            <button onClick={() => setTheme('dark')}>Dark</button>
        </>
    )
}
