import {
  createComplaintService,
  getComplaintsService,
  getComplaintByIdService,
  updateComplaintService,
  deleteComplaintService,
} from "../../src/Complaints/complaints.service";

import { ComplaintsTable } from "../../src/drizzle/schema";

// Mocks
jest.mock("../../src/drizzle/db", () => {
  const insertMock = jest.fn(() => ({
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([{ complaint_id: 1, message: "Test complaint" }]),
  }));

  const updateMock = jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([{ complaint_id: 1, message: "Updated" }]),
  }));

  const deleteMock = jest.fn(() => ({
    where: jest.fn().mockResolvedValue(undefined),
  }));

  return {
    __esModule: true,
    default: {
      insert: insertMock,
      update: updateMock,
      delete: deleteMock,
      query: {
        ComplaintsTable: {
          findMany: jest.fn(),
          findFirst: jest.fn(),
        },
      },
    },
  };
});

import db from "../../src/drizzle/db";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Complaint Service Unit Tests", () => {
  describe("createComplaintService", () => {
    it("should create and return a complaint", async () => {
      const complaint = { user_id: 1, message: "Test complaint" };
      const result = await createComplaintService(complaint as any);
      expect(result).toEqual({ complaint_id: 1, message: "Test complaint" });
    });
  });

  describe("getComplaintsService", () => {
    it("should return all complaints", async () => {
      const mockComplaints = [{ complaint_id: 1 }, { complaint_id: 2 }];
      (db.query.ComplaintsTable.findMany as jest.Mock).mockResolvedValueOnce(mockComplaints);

      const result = await getComplaintsService();
      expect(result).toEqual(mockComplaints);
    });

    it("should return an empty array if no complaints exist", async () => {
      (db.query.ComplaintsTable.findMany as jest.Mock).mockResolvedValueOnce([]);
      const result = await getComplaintsService();
      expect(result).toEqual([]);
    });
  });

  describe("getComplaintByIdService", () => {
    it("should return a complaint by ID", async () => {
      const mockComplaint = { complaint_id: 1, message: "Test" };
      (db.query.ComplaintsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockComplaint);

      const result = await getComplaintByIdService(1);
      expect(result).toEqual(mockComplaint);
    });

    it("should return undefined if complaint not found", async () => {
      (db.query.ComplaintsTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await getComplaintByIdService(999);
      expect(result).toBeUndefined();
    });
  });

  describe("updateComplaintService", () => {
    it("should update and return complaint", async () => {
      const result = await updateComplaintService(1, { description: "Updated" });
      expect(result).toEqual({ complaint_id: 1, message: "Updated" });
    });
  });

  describe("deleteComplaintService", () => {
    it("should delete a complaint", async () => {
      const result = await deleteComplaintService(1);
      expect(result).toBe("Complaint deleted successfully");
    });
  });
});
