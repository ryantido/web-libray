import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authenticate } from '@/lib/auth';

const updateBookSchema = z.object({
  isbn: z.string().optional(),
  title: z.string().optional(),
  author: z.string().optional(),
  summary: z.string().optional(),
  categories: z.string().optional(),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: Number(params.id) },
    });
    if (!book) {
      return NextResponse.json({ error: 'Livre non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ book }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du livre' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await authenticate(request);
    const body = await request.json();
    const parsedData = updateBookSchema.parse(body);
    const updatedBook = await prisma.book.update({
      where: { id: Number(params.id) },
      data: parsedData,
    });
    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Erreur lors de la mise à jour du livre';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await authenticate(request);
    await prisma.book.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: 'Livre supprimé' }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Erreur lors de la suppression du livre';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
