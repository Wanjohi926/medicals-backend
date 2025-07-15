import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIUser, UsersTable } from "../drizzle/schema";

const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createUserService = async (user: TIUser) => {
  const verificationCode = generateVerificationCode();

  const [createdUser] = await db
    .insert(UsersTable)
    .values({
      ...user,
      is_verified: false,
      verification_code: verificationCode
    })
    .returning();

  return createdUser;
};

export const userLoginService = async (email: string) => {
  return await db.query.UsersTable.findFirst({
    columns: {
      user_id: true,
      email: true,
      password: true,
      is_verified: true
    },
    where: eq(UsersTable.email, email)
  });
};

export const verifyUserService = async (email: string, code: string) => {
  const user = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.email, email)
  });

  if (!user || user.is_verified || user.verification_code !== code) {
    return null;
  }

  const [updated] = await db.update(UsersTable)
    .set({ is_verified: true, verification_code: null })
    .where(eq(UsersTable.email, email))
    .returning();

  return updated;
};

export const getUserService = async () => {
  return await db.query.UsersTable.findMany();
};

export const getUserByIdService = async (id: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, id),
  });
};

export const updateUserService = async (id: number, data: Partial<TIUser>) => {
  const updated = await db
    .update(UsersTable)
    .set(data)
    .where(eq(UsersTable.user_id, id))
    .returning();
  return updated[0];
};

export const deleteUserService = async (id: number) => {
  await db.delete(UsersTable).where(eq(UsersTable.user_id, id));
  return "User deleted successfully";
};
