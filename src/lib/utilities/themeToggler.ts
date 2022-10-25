export function toggleTheme() {
    // Don't try to execute if we're not on the server, we don't have access to localStorage.
    if (typeof window === 'undefined') return;

    localStorage.theme = localStorage.theme === 'light' ? 'dark' : 'light';
    refreshTheme();
}

export function refreshTheme() {
    // Don't try to execute if we're not on the server, we don't have access to localStorage.
    if (typeof window === 'undefined') return;

    let isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}
