'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [categories, setCategories] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchBook = async () => {
      if (!token) {
      router.push('/login')
      return
    }
      try {
        setLoading(true);
        const res = await axios.get<{ book: Book }>(`/api/books/${params.id}`);
        setBook(res.data.book);
        setIsbn(res.data.book.isbn);
        setTitle(res.data.book.title);
        setAuthor(res.data.book.author);
        setSummary(res.data.book.summary || '');
        setCategories(res.data.book.categories || '');
      } catch (err) {
        setError("Erreur lors de la récupération du livre");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      alert('Vous devez être connecté pour modifier un livre.');
      return;
    }
    try {
      await axios.put(
        `/api/books/${params.id}`,
        { isbn, title, author, summary, categories },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push('/books');
    } catch (err) {
      setError("Erreur lors de la modification du livre");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier le Livre</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="text"
          placeholder="Auteur"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <textarea
          placeholder="Résumé"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Catégories"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Modifier
        </button>
      </form>
    </div>
  );
}
