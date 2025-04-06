'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaHome, FaBook, FaHeart, FaSignInAlt, FaUserPlus } from 'react-icons/fa'

export default function NavBar() {
  const [user, setUser] = useState<{ pseudo: string } | null>(null)

  useEffect(() => {
    // On suppose que lors de la connexion, un objet JSON est stocké dans localStorage sous "user"
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.error('Erreur lors du parsing du user dans localStorage', err)
      }
    }
  }, [])

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="flex items-center space-x-2">
          <FaHome className="text-2xl" />
          <span className="font-bold text-xl">Ma Bibliothèque</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/books" className="flex items-center space-x-1 hover:text-gray-200 transition">
            <FaBook />
            <span>Livres</span>
          </Link>
          <Link href="/favorites" className="flex items-center space-x-1 hover:text-gray-200 transition">
            <FaHeart />
            <span>Favoris</span>
          </Link>
          {user ? (
            <span className="ml-4">Bonjour, <strong>{user.pseudo}</strong> !</span>
          ) : (
            <>
              <Link href="/login" className="flex items-center space-x-1 hover:text-gray-200 transition">
                <FaSignInAlt />
                <span>Connexion</span>
              </Link>
              <Link href="/signup" className="flex items-center space-x-1 hover:text-gray-200 transition">
                <FaUserPlus />
                <span>Inscription</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
