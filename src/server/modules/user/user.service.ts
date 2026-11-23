import { EntityType, ImageType, Prisma, PrismaClient, TokenType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { compare, hash } from 'bcryptjs';
import crypto, { randomInt } from 'crypto';
import dayjs from 'dayjs';
import { moneyToNumber } from '~/lib/FuncHandler/Format';
import { regexCheckGuest } from '~/lib/FuncHandler/generateGuestCredentials';
import { getOtpEmail, sendEmail } from '~/lib/FuncHandler/MailHelpers/sendEmail';
import { buildSortFilter } from '~/lib/FuncHandler/PrismaHelper';
import { UserRole } from '~/shared/constants/user.constants';
import { StatusImage } from '~/shared/schema/image.info.schema';
import { ImageClientInput } from '~/shared/schema/image.schema';
import { UserInput } from '~/shared/schema/user.schema';
import { db } from '~/server/db';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

export async function handleUserLock(user: any) {
  if (!user?.isLocked || !user?.lockedUntil) return user;

  const now = dayjs();
  const lockedUntil = dayjs(user.lockedUntil);

  if (now.isAfter(lockedUntil)) {
    const resp = await updateUserCustomService(db, {
      where: { email: user.email },
      data: {
        isLocked: false,
        failedAttempts: 0,
        lockedUntil: null
      }
    });
    if (!resp) throw new Error('Đã có lỗi xảy ra trong quá trình xử lí trạng thái người dùng.');
    return resp;
  }

  const remainingSeconds = lockedUntil.diff(now, 'second');
  const remainingMinutes = Math.ceil(remainingSeconds / 60);
  const text = remainingMinutes <= 0 ? '<1' : remainingMinutes.toString();

  throw new Error(`Tài khoản bị khóa. Vui lòng thử lại sau ${text} phút.`);
}

export async function handleFailedLogin(user: any) {
  const attempts = user.failedAttempts + 1;
  if (attempts >= MAX_FAILED_ATTEMPTS) {
    await updateUserCustomService(db, {
      where: { id: user.id },
      data: {
        isLocked: true,
        failedAttempts: attempts,
        lockedUntil: new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000)
      }
    });
    throw new Error('Tài khoản bị khóa tạm thời do quá nhiều lần đăng nhập sai.');
  }

  await updateUserCustomService(db, {
    where: { id: user.id },
    data: { failedAttempts: attempts }
  });

  throw new Error(`Mật khẩu sai không hợp lệ. Còn lại (${attempts}/${MAX_FAILED_ATTEMPTS}) lần.`);
}

export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  return hashedPassword;
};

export const hashOTP = (otp: string) => {
  const salt = process.env.OTP_SALT || 'default-salt';
  return crypto
    .createHash('sha256')
    .update(otp + salt)
    .digest('hex');
};

export const createOTP = (timeExpiredMinutes = 3) => {
  const now = dayjs();
  const otp = randomInt(100000, 999999).toString();
  const otpExpired = now.add(timeExpiredMinutes, 'minute').toDate();
  const otpHash = hashOTP(otp);
  return {
    otp,
    otpExpired,
    otpHash
  };
};

export const findUserService = async (
  db: PrismaClient,
  input: {
    page: number;
    limit: number;
    s?: string;
    sort?: string[];
    filter?: string;
    include?: Prisma.UserInclude;
  }
) => {
  const { page, limit, s, sort, filter, include } = input;
  const where: Prisma.UserWhereInput = {
    AND: {
      OR: [
        {
          name: { contains: s, mode: 'insensitive' }
        },
        {
          address: {
            detail: { contains: s, mode: 'insensitive' }
          }
        },
        {
          phone: { contains: s, mode: 'insensitive' }
        },
        {
          email: { contains: s, mode: 'insensitive' }
        }
      ],
      isActive: filter?.includes('ACTIVE@#@$@@') ? true : filter?.includes('INACTIVE@#@$@@') ? false : undefined,
      role: {
        name: filter?.includes('STAFF@#@$@@') ? 'STAFF' : filter?.includes('CUSTOMER@#@$@@') ? 'CUSTOMER' : undefined
      }
    }
  };
  const [totalUsers, totalUsersQuery, users] = await db.$transaction([
    db.user.count(),
    db.user.count({
      where,
      orderBy: sort && sort?.length > 0 ? buildSortFilter(sort, ['pointUser', 'name']) : { createdAt: 'desc' }
    }),
    db.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      orderBy: sort && sort?.length > 0 ? buildSortFilter(sort, ['pointUser', 'name']) : { createdAt: 'desc' },
      include: {
        ...(include ?? {}),
        role: true,
        address: true
      }
    })
  ]);
  const totalPages = Math.ceil(
    Object.entries(input)?.length > 2 ? (totalUsersQuery == 0 ? 1 : totalUsersQuery / limit) : totalUsers / limit
  );

  return {
    users,
    pagination: {
      hasNext: Boolean(totalPages > page),
      totalPages
    }
  };
};
export const createUserService = async (db: PrismaClient, input: UserInput, isCredential: boolean) => {
  const { id, avatarImage, address, roleId, ...data } = input;

  const isAdmin = input?.email === process.env.NEXT_PUBLIC_EMAIL_ADMIN;

  const [existed, defaultRole] = await Promise.all([
    db.user.findFirst({
      where: {
        email: input.email
      },
      include: {
        avatarImage: true
      }
    }),
    db.role.findFirst({ where: isAdmin ? { name: UserRole.ADMIN } : { default: true } })
  ]);
  let imageDb: ImageClientInput | undefined, statusFromReq;
  if (avatarImage && avatarImage?.status) {
    const { status, ...data } = avatarImage;
    statusFromReq = status;
    imageDb = data;
  }

  if (existed) {
    if (!existed.isActive) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Email này đã bị vô hiệu hóa.'
      });
    }
    if (existed.isVerified) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Người dùng đã tồn tại. Hãy thử lại.'
      });
    } else {
      throw new TRPCError({
        code: 'NOT_IMPLEMENTED',
        message: 'Tài khoản đã đăng kích nhưng chưa kích hoạt.'
      });
    }
  }

  let otpExpired = dayjs().toDate(),
    otpHash = '',
    otp = '';
  if (!regexCheckGuest.test(input.email) && isCredential) {
    ({ otp, otpExpired, otpHash } = createOTP());
    const emailContent = getOtpEmail(otp, input, 3);
    await sendEmail(input.email, 'Mã OTP kích hoạt tài khoản', emailContent);
  }
  const passwordHash = await hashPassword(input.password);
  const user = await db.user.create({
    data: {
      ...data,
      isVerified: regexCheckGuest.test(input.email) ? true : false,
      password: passwordHash,
      tokens: otpHash
        ? {
            create: {
              tokenHash: otpHash,
              expires: otpExpired,
              type: 'EMAIL_VERIFICATION'
            }
          }
        : undefined,
      address: input.address
        ? ({
            create: input.address
          } as any)
        : undefined,
      pointUser: input.pointUser,
      level: input.level,
      avatarImage:
        statusFromReq === StatusImage.NEW && imageDb
          ? {
              create: {
                ...imageDb,
                url: imageDb?.url || '',
                altText: imageDb?.altText || 'Ảnh đại diện của ' + (data?.name || ''),
                type: imageDb?.type || ImageType.THUMBNAIL
              }
            }
          : undefined,
      role: defaultRole?.id
        ? {
            connect: {
              id: defaultRole?.id
            }
          }
        : {
            create: {
              name: isAdmin ? UserRole.ADMIN : UserRole.CUSTOMER
            }
          }
    }
  });

  return user;
};

export const upsertUserService = async (db: PrismaClient, input: UserInput) => {
  const { id, avatarImage, address, roleId, ...data } = input;
  const existed = await db.user.findUnique({
    where: {
      id: id || 'default_id_findUnique'
    }
  });
  if (existed && existed?.email !== data?.email) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Email này đã tồn tại. Hãy thử lại.'
    });
  }
  let imageDb: ImageClientInput | undefined, statusFromReq;
  if (avatarImage && avatarImage?.status) {
    const { status, ...data } = avatarImage;
    statusFromReq = status;
    imageDb = data;
  }
  const upsertUser = await db.user.upsert({
    where: {
      id: id || 'default_id_user'
    },
    create: {
      ...data,
      role: roleId
        ? {
            connect: {
              id: roleId
            }
          }
        : undefined,
      address: address
        ? {
            create: {
              ...address,
              id: undefined
            }
          }
        : undefined,
      avatarImage:
        statusFromReq === StatusImage.NEW && imageDb
          ? {
              create: {
                ...imageDb,
                id: undefined,
                url: imageDb?.url || '',
                altText: imageDb?.altText || 'Ảnh đại diện của ' + (data?.name || ''),
                type: imageDb?.type || ImageType.THUMBNAIL
              }
            }
          : undefined
    },
    update: {
      ...data,
      role: roleId
        ? {
            connect: {
              id: roleId
            }
          }
        : undefined,
      address: address
        ? {
            upsert: {
              where: {
                id: String(address?.id)
              },
              create: {
                ...address,
                id: undefined
              },
              update: {
                ...address,
                id: undefined
              }
            }
          }
        : undefined,
      avatarImage:
        statusFromReq === StatusImage.DELETED && imageDb?.id
          ? {
              delete: { id: imageDb.id }
            }
          : statusFromReq === StatusImage.NEW && imageDb
            ? {
                upsert: {
                  where: { id: imageDb.id },
                  update: {
                    ...imageDb,
                    url: imageDb?.url || '',
                    altText: imageDb?.altText || 'Ảnh đại diện của ' + (data?.name || ''),
                    type: imageDb?.type || ImageType.THUMBNAIL
                  },
                  create: {
                    ...imageDb,
                    url: imageDb?.url || '',
                    altText: imageDb?.altText || 'Ảnh đại diện của ' + (data?.name || ''),
                    type: imageDb?.type || ImageType.THUMBNAIL
                  }
                }
              }
            : undefined
    }
  });

  return {
    metaData: {
      before: existed ?? {},
      after: upsertUser ?? {}
    }
  };
};

export const updateUserCustomService = async (
  db: PrismaClient,
  input: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }
) => {
  const { where, data } = input;
  const user = await db.user.update({
    where,
    data
  });
  return user;
};

export const uploadImageUserService = async (
  db: PrismaClient,
  data: {
    email: string;
    imgUrl: string;
    meta?: {
      publicId?: string;
      entityType?: EntityType;
      altText?: string;
      type?: ImageType;
    };
  }
) => {
  const { email, imgUrl, meta } = data;

  const type = meta?.type ?? ImageType.THUMBNAIL;
  const altText = `Ảnh ${meta?.altText ?? `người dùng ${email}`}`;

  const imageData = {
    url: imgUrl,
    altText,
    type,
    publicId: meta?.publicId ?? null
  };

  return db.user.update({
    where: {
      email
    },
    data: {
      avatarImage: {
        create: imageData
      }
    }
  });
};

export const deleteUserService = async (db: PrismaClient, input: { id: string }) => {
  const user = await db.user.findUnique({
    where: { id: input.id },
    include: { avatarImage: true }
  });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Ngươi dùng không tồn tại. Hãy thử lại.'
    });
  }
  const deleteduser = await db.user.delete({ where: { id: input.id } });

  return {
    metaData: {
      before: deleteduser ?? {},
      after: {}
    }
  };
};
export const getFilterUserService = async (db: PrismaClient, input: { s: string; include?: Prisma.UserInclude }) => {
  const user = await db.user.findMany({
    where: {
      OR: [
        { id: { equals: input.s?.trim() } },
        { name: { equals: input.s?.trim() } },
        { email: { equals: input.s?.trim() } },
        {
          role: {
            name: { equals: input.s?.trim() }
          }
        }
      ]
    },
    include: input.include
  });
  return user;
};
export const getSellerService = async (db: PrismaClient, input?: { include?: Prisma.UserInclude }) => {
  const user = await db.user.findMany({
    where: {
      role: {
        name: {
          not: 'CUSTOMER',
          mode: 'insensitive'
        }
      }
    },
    include: {
      ...(input?.include ? input.include : {}),
      role: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  return user;
};
export const getOneUserService = async (db: PrismaClient, input: { key: string; include?: Prisma.UserInclude }) => {
  const { key, include } = input;
  const user = await db.user.findFirst({
    where: {
      OR: [{ id: key }, { email: key }]
    },
    include: {
      orders: { include: { orderItems: true } },
      avatarImage: true,
      role: {
        include: {
          permissions: true
        }
      },
      userPermissions: {
        include: {
          permission: true
        }
      },
      address: true
    }
  });
  const rolePermissions = user?.role?.permissions || [];
  const overrides = user?.userPermissions || [];

  const finalSet = new Set(rolePermissions.map(p => p.id));

  for (const up of overrides) {
    if (up.granted) {
      finalSet.add(up.permissionId);
    } else {
      finalSet.delete(up.permissionId);
    }
  }

  const permissionsFinal = [
    ...rolePermissions.filter(p => finalSet.has(p.id)),
    ...overrides
      .filter(up => up.granted && !rolePermissions.some(p => p.id === up.permissionId))
      .map(up => up.permission)
  ];

  if (!user) {
    return null;
  }
  return {
    ...user,
    orders: user.orders.map(item => ({
      ...item,
      orderItems: item.orderItems.map(orItem => ({
        ...orItem,
        unitPrice: moneyToNumber(orItem.unitPrice),
        discount: moneyToNumber(orItem.discount),
        totalPrice: moneyToNumber(orItem.totalPrice)
      })),
      discountAmount: moneyToNumber(item?.discountAmount),
      finalAmount: moneyToNumber(item?.finalAmount),
      originalAmount: moneyToNumber(item?.originalAmount),
      taxAmount: moneyToNumber(item?.taxAmount),
      shippingAmount: moneyToNumber(item?.shippingAmount)
    })),
    role: {
      ...user.role,
      permissions: permissionsFinal
    }
  };
};

export const getNotGuestService = async (db: PrismaClient, input?: { include?: Prisma.UserInclude }) => {
  const user = await db.user.findMany({
    where: {
      email: {
        not: {
          startsWith: 'guest_'
        }
      }
    },
    include: { ...(input?.include ?? {}), role: true }
  });
  return user;
};
export const verifyEmailService = async (
  db: PrismaClient,
  input: {
    email: string;
    timeExpiredMinutes: number | 3;
    type: TokenType;
  }
) => {
  const { email, timeExpiredMinutes, type } = input;
  const user = await db.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Email không tồn tại.'
    });
  }

  const now = dayjs();
  const lockedUntil = dayjs(user.lockedUntil);
  if (user.isLocked && now.isBefore(lockedUntil)) {
    const remainingSeconds = lockedUntil.diff(now, 'second');
    const remainingMinutes = Math.ceil(remainingSeconds / 60);
    const text = remainingMinutes <= 0 ? '<1' : remainingMinutes.toString();
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Tài khoản tạm thời bị khóa. Thử lại sau ${text} phút.`
    });
  }
  const { otp, otpExpired, otpHash } = createOTP();
  await db.token.upsert({
    where: {
      email_type: {
        email,
        type
      }
    },
    create: {
      email,
      expires: otpExpired,
      tokenHash: otpHash,
      type
    },
    update: {
      email,
      expires: otpExpired,
      tokenHash: otpHash,
      type
    }
  });
  const emailContent = getOtpEmail(otp, user, timeExpiredMinutes);
  await sendEmail(email, 'Mã OTP đặt lại mật khẩu', emailContent);
  return user;
};
export const resetPasswordService = async (
  db: PrismaClient,
  input: {
    email: string;
    password: string;
    token: string;
  }
) => {
  const token = await db.token.findUnique({
    where: {
      email: input.email,
      tokenHash: input.token
    },
    include: {
      user: true
    }
  });
  if (!token) {
    throw new TRPCError({
      code: 'TIMEOUT',
      message: 'Mã OTP không hợp lệ.'
    });
  }

  const isTokenValid = dayjs(token.expires).isAfter(dayjs());

  if (!isTokenValid) {
    throw new TRPCError({
      code: 'TIMEOUT',
      message: 'Mã OTP đã hết hạn.'
    });
  }

  const isSameAsCurrent = await compare(input.password, token.user.password);
  if (isSameAsCurrent) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Gần đây bạn đã sử dụng mật khẩu này. Vui lòng sử dụng mật khẩu khác.'
    });
  }

  const hashedPassword = await hashPassword(input.password);

  await db.user.update({
    where: { id: token.user.id },
    data: {
      password: hashedPassword,
      tokens: {
        delete: {
          id: token.id
        }
      }
    }
  });
  const { password, ...rest } = token.user;
  return rest;
};

export const verifyOtpService = async (db: PrismaClient, input: { email: string; otp?: string; token?: string }) => {
  const { email, otp, token } = input;
  const now = dayjs().toDate();
  const otpHash = otp && !token ? hashOTP(otp) : token;
  const resp = await db.token.findUnique({
    where: {
      email,
      tokenHash: otpHash,
      expires: {
        gt: now
      }
    },
    include: {
      user: true
    }
  });

  if (!resp) {
    throw new TRPCError({
      code: 'TIMEOUT',
      message: 'OTP không hợp lệ hoặc đã hết hạn.'
    });
  }
  const { password, ...rest } = resp.user;
  return {
    ...resp,
    user: { ...rest }
  };
};

export const getOverviewUserService = async (db: PrismaClient, input: { key: string }) => {
  const { key } = input;
  const [user, overview] = await Promise.all([
    getOneUserService(db, { key }),
    db.order.aggregate({
      where: { userId: key },
      _count: { id: true },
      _sum: { finalAmount: true },
      _max: { finalAmount: true },
      _avg: { finalAmount: true }
    })
  ]);
  return {
    user,
    overview: {
      spent: moneyToNumber(overview._sum.finalAmount),
      quantity: overview._count.id,
      max: moneyToNumber(overview._max.finalAmount),
      avg: moneyToNumber(overview._avg.finalAmount)
    }
  };
};
