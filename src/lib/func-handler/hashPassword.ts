import { hash } from 'bcryptjs';

export async function hashPassword(password: string) {
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  return hashedPassword;
}
