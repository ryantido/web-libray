// src/app/api/books/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bookSchema = z.object({
  isbn: z.string(),
  title: z.string(),
  author: z.string(),
  summary: z.string().optional(),
  categories: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = bookSchema.parse(body);
    const newBook = await prisma.book.create({ data: parsedData });
    return NextResponse.json(newBook, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Erreur lors de la création du livre';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    
    const rawSearch = (searchParams.get('search') || '').trim();
    const rawCategory = (searchParams.get('category') || '').trim();
    const sortParam = searchParams.get('sort') || 'createdAt_desc';

    let where: Record<string, any> = {};
    if (rawSearch && rawCategory) {
      where = {
        AND: [
          {
            OR: [
              { title: { contains: rawSearch } },
              { author: { contains: rawSearch } },
              { isbn: { contains: rawSearch } },
            ],
          },
          { categories: rawCategory },
        ],
      };
    } else if (rawSearch) {
      where = {
        OR: [
          { title: { contains: rawSearch } },
          { author: { contains: rawSearch } },
          { isbn: { contains: rawSearch } },
        ],
      };
    } else if (rawCategory) {
      where = { categories: rawCategory };
    }
    
    let orderBy: Record<string, 'asc' | 'desc'> = {};
    // Gestion du tri
    if (sortParam === 'title_asc') {
      orderBy = { title: 'asc' };
    } else if (sortParam === 'title_desc') {
      orderBy = { title: 'desc' };
    } else if (sortParam === 'createdAt_asc') {
      orderBy = { createdAt: 'asc' };
    } else {
      orderBy = { createdAt: 'desc' };
    }
    
    const [books, totalCount] = await Promise.all([
      prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.book.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    return NextResponse.json({ books, totalPages }, { status: 200 });
  } catch (error: unknown) {
    console.error('Erreur dans GET /api/books:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des livres' }, { status: 500 });
  }
}
