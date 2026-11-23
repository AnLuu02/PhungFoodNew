const COOLDOWN_SECONDS = 5;
const KEY = 'loginCooldown';

export function checkLoginCooldown(): { blocked: boolean; remaining: number } {
  const last = localStorage.getItem(KEY);
  if (!last) return { blocked: false, remaining: 0 };

  const diffSec = (Date.now() - Number(last)) / 1000;
  if (diffSec < COOLDOWN_SECONDS) {
    return { blocked: true, remaining: Math.ceil(COOLDOWN_SECONDS - diffSec) };
  }

  return { blocked: false, remaining: 0 };
}

export function setLoginCooldown() {
  localStorage.setItem(KEY, Date.now().toString());
}
