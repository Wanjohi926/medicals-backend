import {
  createPrescriptionService,
  getPrescriptionsService,
  getPrescriptionByIdService,
  updatePrescriptionsService,
  deletePrescriptionsService,
} from "../../src/Prescriptions/prescriptions.service";

import { PrescriptionsTable } from "../../src/drizzle/schema";

// Mock db
jest.mock("../../src/drizzle/db", () => {
  const returningData = [{
    prescription_id: 1,
    notes: "Take 2 pills daily",
    doctor_id: 1,
    appointment_id: 1,
    patient_id: 2,
  }];

  const insertMock = jest.fn(() => ({
    values: jest.fn(() => ({
      returning: jest.fn().mockResolvedValue(returningData),
    })),
  }));

  const deleteMock = jest.fn(() => ({
    where: jest.fn().mockResolvedValue(undefined),
  }));

  const updateMock = jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue(returningData),
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
        PrescriptionsTable: {
          findMany: findManyMock,
          findFirst: findFirstMock,
        },
      },
    },
  };
});

import db from "../../src/drizzle/db";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("prescription service", () => {
  describe("createPrescriptionService", () => {
    it("should insert a prescription and return created record", async () => {
      const prescription = {
        notes: "Take 2 pills daily",
        appointment_id: 1,
        doctor_id: 1,
        patient_id: 2,
      };

      const result = await createPrescriptionService(prescription);
      expect(db.insert).toHaveBeenCalledWith(PrescriptionsTable);
      expect(result).toHaveProperty("prescription_id", 1);
      expect(result.notes).toBe("Take 2 pills daily");
    });
  });

  describe("getPrescriptionsService", () => {
    it("should return all prescriptions", async () => {
      const prescriptions = [
        { prescription_id: 1, notes: "Take 1 pill", doctor_id: 1 },
        { prescription_id: 2, notes: "Take 2 pills", doctor_id: 2 },
      ];

      (db.query.PrescriptionsTable.findMany as jest.Mock).mockResolvedValueOnce(prescriptions);

      const result = await getPrescriptionsService();
      expect(result).toEqual(prescriptions);
    });

    it("should return an empty array if no prescriptions", async () => {
      (db.query.PrescriptionsTable.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await getPrescriptionsService();
      expect(result).toEqual([]);
    });
  });

  describe("getPrescriptionByIdService", () => {
    it("should return a prescription by ID", async () => {
      const prescription = { prescription_id: 1, notes: "Take medicine" };

      (db.query.PrescriptionsTable.findFirst as jest.Mock).mockResolvedValueOnce(prescription);

      const result = await getPrescriptionByIdService(1);
      expect(result).toEqual(prescription);
    });

    it("should return undefined if prescription not found", async () => {
      (db.query.PrescriptionsTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await getPrescriptionByIdService(999);
      expect(result).toBeUndefined();
    });
  });

  describe("updatePrescriptionsService", () => {
    it("should update a prescription and return updated data", async () => {
      const updateData = { notes: "Updated dosage" };

      const result = await updatePrescriptionsService(1, updateData);
      expect(result).toEqual({
        prescription_id: 1,
        notes: "Take 2 pills daily",
        doctor_id: 1,
        appointment_id: 1,
        patient_id: 2,
      });
    });
  });

  describe("deletePrescriptionsService", () => {
    it("should delete a prescription and return success message", async () => {
      const result = await deletePrescriptionsService(1);
      expect(db.delete).toHaveBeenCalledWith(PrescriptionsTable);
      expect(result).toBe("Prescription deleted successfully");
    });
  });
});
