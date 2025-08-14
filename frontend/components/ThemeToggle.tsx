'use client'

export default function ThemeToggle() {
    return (
        <button
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
                const c = document.documentElement.classList
                const isDark = c.contains('dark')
                c.toggle('dark')
                localStorage.setItem('theme', isDark ? 'light' : 'dark')
            }}
        >
            Toggle theme
        </button>
    )
}
