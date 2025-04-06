import jwt, { JwtPayload } from 'jsonwebtoken';

export function verifyToken(token: string): JwtPayload | string {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload | string;
  } catch (error: unknown) {
    console.error('Token invalide : ', error);
    throw new Error('Token invalide');
  }
}

export async function authenticate(request: Request): Promise<JwtPayload | string> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    throw new Error('Token manquant');
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('Token mal formaté');
  }
  const token = parts[1];
  return verifyToken(token);
}
