'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

// Disable SSG for this page since it's only used in OAuth callback
export const dynamic = 'force-dynamic'

function GoogleCallbackContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Processing...')

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
          setStatus(`Error: ${error}`)
          setTimeout(() => window.close(), 2000)
          return
        }

        if (!code) {
          setStatus('No authorization code received')
          setTimeout(() => window.close(), 2000)
          return
        }

        // Note: In production, exchange the code for access token on your backend
        // For now, we'll store the code and let the client handle it
        // This is a security risk - you should exchange the code on your backend!

        // Store code temporarily - frontend should send to backend to exchange for token
        localStorage.setItem('googleAuthCode', code)

        setStatus('Authorization successful! Closing window...')
        setTimeout(() => window.close(), 1000)
      } catch (error) {
        console.error('Error processing callback:', error)
        setStatus('Error processing authorization')
        setTimeout(() => window.close(), 2000)
      }
    }

    processCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-lg text-gray-900">{status}</p>
      </div>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <p className="text-lg text-gray-900">Loading...</p>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  )
}
