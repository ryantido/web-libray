import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
  pseudo: z.string().min(3),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username, pseudo } = signupSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Utilisateur déjà existant' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        pseudo,
      },
    });

    return NextResponse.json({ message: 'Utilisateur créé avec succès', userId: user.id }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur lors de l\'inscription';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
