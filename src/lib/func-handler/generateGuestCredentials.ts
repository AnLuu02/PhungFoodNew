import { randomBytes } from 'crypto';

export function generateGuestCredentials() {
  const id = randomBytes(8).toString('hex'); // 16 ký tự ngẫu nhiên
  const email = `guest_${id}@quickbuy.local`; // đảm bảo unique
  const password = randomBytes(16).toString('hex'); // random password
  return { email, password };
}
