'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      const { token } = res.data
      localStorage.setItem('token', token)
      if (res.data.user) {//+
        localStorage.setItem('user', JSON.stringify({ pseudo: res.data.user.username }));
      }
      router.push('/books')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la connexion')
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Se connecter
        </button>
      </form>
      <p className="mt-4">
        Pas encore inscrit ?{' '}
        <a href="/signup" className="text-blue-500 underline">
          Inscrivez-vous
        </a>
      </p>
    </div>
  )
}

