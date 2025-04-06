'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

type Book = {
  id: number
  isbn: string
  title: string
  author: string
  summary?: string
  categories?: string
  createdAt: string
  updatedAt: string
}

type BookDetailResponse = {
  book: Book
}

export default function BookDetailPage() {
  const router = useRouter()
  const params = useParams() as { id: string }
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchBook = async () => {      
      try {
        setLoading(true);
        const res = await axios.get<BookDetailResponse>(`/api/books/${params.id}`);
        setBook(res.data.book);
      } catch (err) {
        setError("Erreur lors de la récupération du livre");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [params.id]);

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => router.push('/books')} className="mb-4 text-blue-500 underline">
        &larr; Retour à la liste
      </button>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : book ? (
        <div className="border rounded p-4">
          <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
          <p className="mb-2"><strong>Auteur :</strong> {book.author}</p>
          <p className="mb-2"><strong>ISBN :</strong> {book.isbn}</p>
          <p className="mb-2"><strong>Résumé :</strong> {book.summary || 'Aucun résumé'}</p>
          <p className="mb-2"><strong>Catégories :</strong> {book.categories || 'Non spécifié'}</p>
          <p className="text-sm text-gray-500">
            Créé le : {new Date(book.createdAt).toLocaleDateString()}
          </p>
        </div>
      ) : null}
    </div>
  );
}
