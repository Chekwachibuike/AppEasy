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
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true'
    if (!isLoggedIn && router.pathname !== '/login' && router.pathname !== '/signup') {
      router.replace('/login')
    }
    if (isLoggedIn && (router.pathname === '/login' || router.pathname === '/signup')) {
      router.replace('/')
    }
  }, [router])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  )
}