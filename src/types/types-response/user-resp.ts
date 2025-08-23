import { RouterOutputs } from '~/trpc/react';

export type UserCreateOutput = RouterOutputs['User']['create'];
export type UserUpdateOutput = RouterOutputs['User']['update'];
export type UserDeleteOutput = RouterOutputs['User']['delete'];
export type UserGetOneOutput = RouterOutputs['User']['getOne'];
export type UserFindOutput = RouterOutputs['User']['find'];
export type UserGetFilterOutput = RouterOutputs['User']['getFilter'];
export type UserGetAllOutput = RouterOutputs['User']['getAll'];

export type UserRequestPasswordResetOutput = RouterOutputs['User']['requestPasswordReset'];
export type UserResetPasswordOutput = RouterOutputs['User']['resetPassword'];
export type UserVerifyOtpOutput = RouterOutputs['User']['verifyOtp'];
