'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { data, error } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setMessage(`Erro: ${error.message}`)
      } else if (data?.user) {
        setMessage('Autenticação bem-sucedida! Redirecionando...')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1500)
      }
    } catch (err) {
      setMessage('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const isError = message.includes('Erro')

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Link href="/" className="flex items-center gap-2 justify-center mb-8">
            <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              WhatsApp Contact Manager
            </h1>
            <p className="text-gray-600 text-sm">
              Organize seus contatos por contexto
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                required
              />
            </div>

            {message && (
              <div className={isError ? 'p-3 rounded-lg text-sm bg-red-100 text-red-700' : 'p-3 rounded-lg text-sm bg-green-100 text-green-700'}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
            >
              {isLoading ? 'Carregando...' : isSignUp ? 'Cadastro' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setMessage('')
              }}
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              {isSignUp
                ? 'Já tem conta? Entrar'
                : 'Não tem conta? Cadastro'}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              <Link href="/" className="hover:text-green-600">
                Voltar para home
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white bg-opacity-80 rounded-lg p-4 text-center text-sm text-gray-600">
          <p className="mb-2">
            <strong>Versão Gratuita:</strong> até 50 contatos
          </p>
          <p>
            <strong>Premium:</strong> contatos ilimitados e lembretes
          </p>
        </div>
      </div>
    </main>
  )
}
