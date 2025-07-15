import { createUserService, getUserService, getUserByIdService, deleteUserService, updateUserService, userLoginService, verifyUserService } from "../../src/users/users.service";
import { UsersTable } from "../../src/drizzle/schema";

jest.mock("../../src/drizzle/db", () => {
  const insertMock = jest.fn(() => ({
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([
      {
        user_id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        is_verified: false
      }
    ])
  }));

  const deleteMock = jest.fn(() => ({
    where: jest.fn().mockResolvedValue(undefined),
  }));

  const updateMock = jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([
      {
        user_id: 1,
        first_name: "Updated",
        is_verified: true
      }
    ])
  }));

  const findManyMock = jest.fn();
  const findFirstMock = jest.fn();

  return {
    __esModule: true,
    default: {
      insert: insertMock,
      delete: deleteMock,
      update: updateMock,
      query: {
        UsersTable: {
          findMany: findManyMock,
          findFirst: findFirstMock
        }
      }
    }
  };
});

import db from "../../src/drizzle/db";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("User Service Unit Tests", () => {
  describe("createUserService", () => {
    it("should insert a user and return the created user", async () => {
      const user = {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        password: "securePassword123",
        contact_phone: "0712345678",
        address: "Nairobi"
      };

      const result = await createUserService(user);
      expect(db.insert).toHaveBeenCalledWith(UsersTable);
      expect(result).toEqual({
        user_id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        is_verified: false
      });
    });
  });

  describe("getUserService", () => {
    it("should return all users", async () => {
      const users = [{ user_id: 1 }, { user_id: 2 }];
      const mockFindMany = db.query.UsersTable.findMany as jest.Mock;
      mockFindMany.mockResolvedValueOnce(users);

      const result = await getUserService();
      expect(result).toEqual(users);
    });

    it("should return an empty array if no users found", async () => {
      const mockFindMany = db.query.UsersTable.findMany as jest.Mock;
      mockFindMany.mockResolvedValueOnce([]);

      const result = await getUserService();
      expect(result).toEqual([]);
    });
  });

  describe("getUserByIdService", () => {
    it("should return a user by ID", async () => {
      const user = { user_id: 1 };
      const mockFindFirst = db.query.UsersTable.findFirst as jest.Mock;
      mockFindFirst.mockResolvedValueOnce(user);

      const result = await getUserByIdService(1);
      expect(result).toEqual(user);
    });

    it("should return undefined if user not found", async () => {
      const mockFindFirst = db.query.UsersTable.findFirst as jest.Mock;
      mockFindFirst.mockResolvedValueOnce(undefined);

      const result = await getUserByIdService(99);
      expect(result).toBeUndefined();
    });
  });

  describe("deleteUserService", () => {
    it("should delete a user and return success message", async () => {
      const result = await deleteUserService(1);
      expect(db.delete).toHaveBeenCalledWith(UsersTable);
      expect(result).toBe("User deleted successfully");
    });
  });

  describe("updateUserService", () => {
    it("should update a user and return updated user", async () => {
      const userData = { first_name: "Updated" };
      const result = await updateUserService(1, userData);
      expect(result).toEqual({
        user_id: 1,
        first_name: "Updated",
        is_verified: true
      });
    });
  });

  describe("userLoginService", () => {
    it("should return a user by email", async () => {
      const mockUser = {
        user_id: 1,
        email: "john@example.com",
        password: "hashed",
        is_verified: true
      };
      const mockFindFirst = db.query.UsersTable.findFirst as jest.Mock;
      mockFindFirst.mockResolvedValueOnce(mockUser);

      const result = await userLoginService("john@example.com");
      expect(result).toEqual(mockUser);
    });
  });

  describe("verifyUserService", () => {
    it("should return null if user not found", async () => {
      const mockFindFirst = db.query.UsersTable.findFirst as jest.Mock;
      mockFindFirst.mockResolvedValueOnce(undefined);

      const result = await verifyUserService("no@email.com", "123456");
      expect(result).toBeNull();
    });

    it("should return null if already verified", async () => {
      const mockFindFirst = db.query.UsersTable.findFirst as jest.Mock;
      mockFindFirst.mockResolvedValueOnce({
        is_verified: true,
        verification_code: "123456"
      });

      const result = await verifyUserService("john@example.com", "123456");
      expect(result).toBeNull();
    });

    it("should return null if code does not match", async () => {
      const mockFindFirst = db.query.UsersTable.findFirst as jest.Mock;
      mockFindFirst.mockResolvedValueOnce({
        is_verified: false,
        verification_code: "999999"
      });

      const result = await verifyUserService("john@example.com", "123456");
      expect(result).toBeNull();
    });

    it("should update and return verified user", async () => {
      const mockFindFirst = db.query.UsersTable.findFirst as jest.Mock;
      mockFindFirst.mockResolvedValueOnce({
        email: "john@example.com",
        is_verified: false,
        verification_code: "123456"
      });

      const result = await verifyUserService("john@example.com", "123456");
      expect(result).toEqual({
        user_id: 1,
        first_name: "Updated",
        is_verified: true
      });
    });
  });
});
