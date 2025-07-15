import {
  createPaymentService,
  getAllPaymentsService,
  getPaymentByIdService,
  updatePaymentService,
  deletePaymentService,
} from "../../src/Payments/payments.services";

import { PaymentsTable } from "../../src/drizzle/schema";


jest.mock("../../src/drizzle/db", () => {
  const mockReturning = jest.fn().mockResolvedValue([
    {
      payment_id: 1,
      appointment_id: 42,
      amount: 5000,
      transaction_id: "TXN-10001",
      payment_status: "Completed"
    }
  ]);

  const insert = jest.fn(() => ({
    values: jest.fn().mockReturnThis(),
    returning: mockReturning
  }));

  const update = jest.fn((table) => ({
    set: jest.fn(() => ({
      where: jest.fn(() => ({
        returning: mockReturning
      }))
    }))
  }));

  const remove = jest.fn((table) => ({
    where: jest.fn(() => ({
      returning: mockReturning
    }))
  }));

  const select = jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockResolvedValue([
      {
        payment_id: 1,
        appointment_id: 42,
        amount: 5000,
        transaction_id: "TXN-10001",
        payment_status: "Completed"
      }
    ])
  }));

  const findMany = jest.fn().mockResolvedValue([
    {
      payment_id: 1,
      appointment_id: 42,
      amount: 5000,
      transaction_id: "TXN-10001",
      payment_status: "Completed"
    }
  ]);

  return {
    __esModule: true,
    default: {
      insert,
      update,
      delete: remove,
      select,
      query: {
        PaymentsTable: {
          findMany
        }
      }
    }
  };
});


import db from "../../src/drizzle/db";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Payment Service Unit Tests", () => {
  const samplePayment = {
    appointment_id: 42,
    amount: 5000,
    transaction_id: "TXN-10001",
    payment_status: "Completed",
  };

  describe("createPaymentService", () => {
    it("should insert and return new payment", async () => {
      const result = await createPaymentService(samplePayment as any);
      expect(db.insert).toHaveBeenCalledWith(PaymentsTable);
      expect(result).toHaveProperty("payment_id", 1);
    });

    it("should throw an error if insertion fails", async () => {
      (db.insert as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Insert failed");
      });

      await expect(createPaymentService(samplePayment as any)).rejects.toThrow("Insert failed");
    });
  });

  describe("getAllPaymentsService", () => {
    it("should return all payments", async () => {
      const result = await getAllPaymentsService();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return an empty array if no records found", async () => {
      (db.query.PaymentsTable.findMany as jest.Mock).mockResolvedValueOnce([]);
      const result = await getAllPaymentsService();
      expect(result).toEqual([]);
    });

    it("should throw error if findMany fails", async () => {
      (db.query.PaymentsTable.findMany as jest.Mock).mockRejectedValueOnce(new Error("Query error"));
      await expect(getAllPaymentsService()).rejects.toThrow("Query error");
    });
  });

  describe("getPaymentByIdService", () => {
    it("should return a payment by ID", async () => {
      const result = await getPaymentByIdService(1);
      expect(result).toHaveProperty("payment_id", 1);
    });

  });

  describe("updatePaymentService", () => {
    it("should update and return the payment", async () => {
      const result = await updatePaymentService(1, { payment_status: "Refunded" });
      expect(result).toHaveProperty("payment_status", "Completed"); // mocked value
    });

    it("should return undefined if update returns nothing", async () => {
      (db.update(PaymentsTable).set({}).where(expect.anything()).returning as jest.Mock).mockResolvedValueOnce([]);
      const result = await updatePaymentService(999, { payment_status: "Refunded" });
      expect(result).toBeUndefined();
    });

    it("should throw if update fails", async () => {
      (db.update(PaymentsTable).set({}).where(expect.anything()).returning as jest.Mock).mockRejectedValueOnce(new Error("Update failed"));
      await expect(updatePaymentService(1, {})).rejects.toThrow("Update failed");
    });
  });

  describe("deletePaymentService", () => {
    it("should delete and return deleted payment", async () => {
      const result = await deletePaymentService(1);
      expect(result).toHaveProperty("payment_id", 1);
    });

    it("should return undefined if nothing was deleted", async () => {
      (db.delete(PaymentsTable).where(expect.anything()).returning as jest.Mock).mockResolvedValueOnce([]);
      const result = await deletePaymentService(999);
      expect(result).toBeUndefined();
    });

    it("should throw if delete fails", async () => {
      (db.delete(PaymentsTable).where(expect.anything()).returning as jest.Mock).mockRejectedValueOnce(new Error("Delete failed"));
      await expect(deletePaymentService(1)).rejects.toThrow("Delete failed");
    });
  });
});
