import dayjs from 'dayjs';
import { api } from '~/trpc/server';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

export async function handleUserLock(user: any) {
  if (!user?.isLocked || !user?.lockedUntil) return user;

  const now = dayjs();
  const lockedUntil = dayjs(user.lockedUntil);

  if (now.isAfter(lockedUntil)) {
    const resp = await api.User.updateCustom({
      where: { email: user.email },
      data: {
        isLocked: false,
        failedAttempts: 0,
        lockedUntil: null
      }
    });
    if (!resp.data) throw new Error('Đã có lỗi xảy ra trong quá trình xử lí trạng thái người dùng.');
    return resp.data;
  }

  const remainingSeconds = lockedUntil.diff(now, 'second');
  const remainingMinutes = Math.ceil(remainingSeconds / 60);
  const text = remainingMinutes <= 0 ? '<1' : remainingMinutes.toString();

  throw new Error(`Tài khoản bị khóa. Vui lòng thử lại sau ${text} phút.`);
}

export async function handleFailedLogin(user: any) {
  const attempts = user.failedAttempts + 1;
  if (attempts >= MAX_FAILED_ATTEMPTS) {
    await api.User.updateCustom({
      where: { id: user.id },
      data: {
        isLocked: true,
        failedAttempts: attempts,
        lockedUntil: new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000)
      }
    });
    throw new Error('Tài khoản bị khóa tạm thời do quá nhiều lần đăng nhập sai.');
  }

  await api.User.updateCustom({
    where: { id: user.id },
    data: { failedAttempts: attempts }
  });

  throw new Error(`Mật khẩu sai không hợp lệ. Còn lại (${attempts}/${MAX_FAILED_ATTEMPTS}) lần.`);
}
