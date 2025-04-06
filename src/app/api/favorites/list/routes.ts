// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { authenticate } from '@/lib/auth';

// export async function GET(request: Request) {
//   try {
//     const user = await authenticate(request);
//     const favorites = await prisma.favorite.findMany({
//       where: { userId: user.userId },
//       include: { book: true },
//     });
//     const books = favorites.map((fav) => fav.book);
//     return NextResponse.json({ books }, { status: 200 });
//   } catch (error: unknown) {
//     console.error(error);
//     return NextResponse.json({ error: 'Erreur lors de la récupération des favoris' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await authenticate(request);
    // On suppose que le token contient une propriété "userId"
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.userId },
      include: { book: true },
    });
    const books = favorites.map((fav) => fav.book);
    return NextResponse.json({ books }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des favoris' }, { status: 500 });
  }
}

