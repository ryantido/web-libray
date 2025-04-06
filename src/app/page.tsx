'use client'

import Link from 'next/link'
import { FaBookOpen, FaHeart, FaSearch, FaQuoteLeft } from 'react-icons/fa'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Section Héros */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Bienvenue sur Ma Bibliothèque</h1>
          <p className="text-xl text-gray-700 mb-8">
            Découvrez, explorez et partagez votre passion pour la lecture dans une interface moderne et intuitive.
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/books">
              <button className="flex items-center bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition">
                <FaBookOpen className="mr-2" /> Explorer les Livres
              </button>
            </Link>
            <Link href="/favorites">
              <button className="flex items-center bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition">
                <FaHeart className="mr-2" /> Mes Favoris
              </button>
            </Link>
            <Link href="/books">
              <button className="flex items-center bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition">
                <FaSearch className="mr-2" /> Rechercher
              </button>
            </Link>
          </div>
        </section>

        {/* Section Fonctionnalités */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border rounded shadow hover:shadow-lg transition">
            <FaBookOpen className="text-4xl text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Large Collection</h2>
            <p className="text-gray-600">
              Explorez une vaste collection de livres couvrant de nombreux genres et domaines de connaissances.
            </p>
          </div>
          <div className="p-6 border rounded shadow hover:shadow-lg transition">
            <FaSearch className="text-4xl text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Recherche Avancée</h2>
            <p className="text-gray-600">
              Utilisez des filtres intelligents, le tri et la recherche par mots-clés pour trouver exactement ce que vous cherchez.
            </p>
          </div>
          <div className="p-6 border rounded shadow hover:shadow-lg transition">
            <FaHeart className="text-4xl text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Favoris &amp; Partage</h2>
            <p className="text-gray-600">
              Sauvegardez vos livres préférés et partagez-les avec vos amis pour inspirer leur lecture.
            </p>
          </div>
        </section>

        {/* Section Témoignages */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Ce que nos lecteurs disent</h2>
          <div className="space-y-8">
            <div className="p-6 border rounded shadow">
              <FaQuoteLeft className="text-3xl text-gray-400 mb-4" />
              <p className="text-xl italic">"Cette application m'a permis de redécouvrir ma passion pour la lecture. L'interface est intuitive et moderne."</p>
              <p className="mt-4 font-bold">- Alex</p>
            </div>
            <div className="p-6 border rounded shadow">
              <FaQuoteLeft className="text-3xl text-gray-400 mb-4" />
              <p className="text-xl italic">"Une bibliothèque numérique qui combine élégance, simplicité et efficacité. Je recommande vivement!"</p>
              <p className="mt-4 font-bold">- Camille</p>
            </div>
          </div>
        </section>

        {/* Appel à l'action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer votre aventure littéraire ?</h2>
          <Link href="/signup">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded hover:bg-indigo-700 transition">
              Rejoignez-nous dès maintenant
            </button>
          </Link>
        </section>
      </main>
    </div>
  )
}
