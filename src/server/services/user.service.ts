export const findExistingUser = async (db: any, email: string) => {
  return db.User.findFirst({ where: { email } });
};
export function findUser() {}
export function createUser() {}
export function deleteUser() {}
export function getAllUser() {}
export function getFilterUser() {}
export function getOneUser() {}
export function updateCustomUser() {}
export function updateUser() {}
export function getSalerUser() {}
export function updateAnyUser() {}
export function getNotGuestUser() {}
export function verifyEmailUser() {}
export function resetPasswordUser() {}
export function verifyOtpUser() {}
