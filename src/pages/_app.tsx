import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'
import { useRouter } from 'next/router'
import { ThemeProvider } from 'next-themes'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }))
  const router = useRouter()
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check authentication status immediately
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true'
    const currentPath = router.pathname

    // If not logged in and trying to access protected routes, redirect to login
    if (!isLoggedIn && currentPath !== '/login' && currentPath !== '/signup') {
      router.replace('/login')
      return
    }

    // If logged in and on auth pages, redirect to dashboard
    if (isLoggedIn && (currentPath === '/login' || currentPath === '/signup')) {
      router.replace('/')
      return
    }
  }, [router.pathname])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  )
}