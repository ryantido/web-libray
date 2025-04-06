import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/auth';
import { z } from 'zod';

const favoriteSchema = z.object({
  bookId: z.number(),
});

// POST /api/favorites : Ajouter un favori (authentification requise)
export async function POST(request: Request) {
  try {
    const user = await authenticate(request);
    const body = await request.json();
    const { bookId } = favoriteSchema.parse(body);

    const existing = await prisma.favorite.findUnique({
      where: { userId_bookId: { userId: user.userId, bookId } },
    });
    if (existing) {
      return NextResponse.json({ message: 'Favori déjà ajouté' }, { status: 200 });
    }
    const favorite = await prisma.favorite.create({
      data: { userId: user.userId, bookId },
    });
    return NextResponse.json(favorite, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour des favoris' }, { status: 500 });
  }
}

// DELETE /api/favorites : Supprimer un favori (authentification requise)
export async function DELETE(request: Request) {
  try {
    const user = await authenticate(request);
    const { searchParams } = new URL(request.url);
    const bookId = Number(searchParams.get('bookId'));
    if (!bookId) {
      return NextResponse.json({ error: 'bookId manquant' }, { status: 400 });
    }
    await prisma.favorite.delete({
      where: { userId_bookId: { userId: user.userId, bookId } },
    });
    return NextResponse.json({ message: 'Favori supprimé' }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la suppression du favori' }, { status: 500 });
  }
}
