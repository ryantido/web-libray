'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { FiHeart, FiArrowLeft } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

type Book = {
  id: number
  isbn: string
  title: string
  author: string
  summary?: string
  imageUrl?: string
  categories?: string
  createdAt: string
  updatedAt: string
}

export default function FavoritesPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const fetchFavorites = async () => {
    if (!token) {
      router.push('/login')
      return
    }
    try {
      setLoading(true)
      const res = await axios.get<{ books: Book[] }>('/api/favorites/list', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBooks(res.data.books)
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la récupération des favoris')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  return (
    <div>
      <div className="container mx-auto p-4">
        <button onClick={() => router.push('/books')} className="mb-4 flex items-center text-blue-500 hover:underline">
          <FiArrowLeft className="mr-1" /> Retour aux livres
        </button>
        <h1 className="text-2xl font-bold mb-4 flex items-center space-x-2">
          <FiHeart className="text-red-500" /> Mes Favoris
        </h1>
        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : books.length === 0 ? (
          <p>Aucun livre favori.</p>
        ) : (
          <ul className="space-y-4">
            {books.map((book) => (
              <li key={book.id} className="p-4 border rounded flex items-center space-x-4">
                {book.imageUrl && (
                  <img src={book.imageUrl} alt={book.title} className="w-16 h-20 object-cover rounded" />
                )}
                <div>
                  <Link href={`/books/${book.id}`} className="font-bold hover:underline">
                    {book.title}
                  </Link>
                  <p>{book.author}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
