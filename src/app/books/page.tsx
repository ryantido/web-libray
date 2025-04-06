'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
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

type BooksResponse = {
  books: Book[]
  totalPages: number
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('createdAt_desc')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        category,
        sort,
      })
      const res = await axios.get<BooksResponse>(`/api/books?${params.toString()}`)
      setBooks(res.data.books)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [page, search, category, sort])

  const handleDelete = async (id: number) => {
    if (!token) {
      alert('Vous devez être connecté pour supprimer un livre.')
      return
    }
    try {
      await axios.delete(`/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchBooks()
    } catch (err) {
      console.error(err)
    }
  }

  const renderPagination = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 border rounded ${i === page ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
        >
          {i}
        </button>
      )
    }
    return <div className="flex space-x-2 mt-4 justify-center">{pages}</div>
  }

  return (
    <div>
      <div className="p-4 container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Liste des Livres</h1>
          <Link href="/books/new">
            <button className="bg-green-500 text-white px-4 py-2 rounded">Ajouter un livre</button>
          </Link>
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Recherche..."
            className="border rounded p-2 w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
            }}
            className="border rounded p-2 w-full"
          >
            <option value="">Toutes les catégories</option>
            <option value="Programmation">Programmation</option>
            <option value="Littérature">Littérature</option>
            <option value="Science">Science</option>
          </select>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              setPage(1)
            }}
            className="border rounded p-2 w-full"
          >
            <option value="createdAt_desc">Nouveauté</option>
            <option value="createdAt_asc">Ancienneté</option>
            <option value="title_asc">Titre A-Z</option>
            <option value="title_desc">Titre Z-A</option>
          </select>
        </div>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <ul className="space-y-2">
            {books.map((book) => (
              <li key={book.id} className="p-4 border rounded flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {book.imageUrl && (
                    <img src={book.imageUrl} alt={book.title} className="w-16 h-20 object-cover rounded" />
                  )}
                  <div>
                    <Link href={`/books/${book.id}`}>
                      <h2 className="font-bold hover:underline">{book.title}</h2>
                    </Link>
                    <p>{book.author}</p>
                    <p className="text-sm text-gray-500">{book.isbn}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/books/edit/${book.id}`}>
                    <button className="p-2 bg-blue-500 text-white rounded">
                      <FiEdit />
                    </button>
                  </Link>
                  <button onClick={() => handleDelete(book.id)} className="p-2 bg-red-500 text-white rounded">
                    <FiTrash2 />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {renderPagination()}
      </div>
    </div>
  )
}
