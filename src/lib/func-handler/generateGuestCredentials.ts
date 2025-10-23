import { randomBytes } from 'crypto';

export function generateGuestCredentials() {
  const id = randomBytes(8).toString('hex');
  const email = `guest_${id}@quickbuy.local`;
  const password = randomBytes(16).toString('hex');
  return { email, password };
}

export const regexCheckGuest = /^guest_[0-9a-f]{16}@quickbuy\.local$/;
