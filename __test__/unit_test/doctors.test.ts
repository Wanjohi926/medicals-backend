import {
  createDoctorService,
  doctorLoginService,
  verifyDoctorService,
  getDoctorService,
  getDoctorByIdService,
  updateDoctorService,
  deleteDoctorService,
} from "../../src/doctors/doctors.service";

import { DoctorsTable } from "../../src/drizzle/schema";

jest.mock("../../src/drizzle/db", () => {
  const insertReturningMock = jest.fn().mockResolvedValue([{
    doctor_id: 1,
    email: "doc@example.com",
    is_verified: false,
    verification_code: "123456"
  }]);

  const updateReturningMock = jest.fn().mockResolvedValue([{
    doctor_id: 1,
    email: "doc@example.com",
    is_verified: true,
    verification_code: null
  }]);

  const findFirstMock = jest.fn();
  const findManyMock = jest.fn();

  return {
    __esModule: true,
    default: {
      insert: jest.fn(() => ({ values: jest.fn().mockReturnThis(), returning: insertReturningMock })),
      update: jest.fn(() => ({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: updateReturningMock
      })),
      delete: jest.fn(() => ({
        where: jest.fn().mockResolvedValue(undefined)
      })),
      query: {
        DoctorsTable: {
          findFirst: findFirstMock,
          findMany: findManyMock,
        }
      }
    }
  };
});

import db from "../../src/drizzle/db";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Doctors Service", () => {
  describe("createDoctorService", () => {
    it("should create a doctor with verification code", async () => {
      const doctor = {
        first_name: "John",
        last_name: "Doe",
        email: "doc@example.com",
        password: "hashed_password",
        contact_phone: "0712345678",
        address: "Nairobi",
        specialization: "Cardiology"
      };

      const result = await createDoctorService(doctor);
      expect(result).toHaveProperty("email", doctor.email);
      expect(result).toHaveProperty("verification_code");
    });
  });

  describe("doctorLoginService", () => {
    it("should return doctor by email", async () => {
      const mockDoctor = {
        doctor_id: 1,
        email: "doc@example.com",
        password: "hashed_password",
        is_verified: false,
      };

      (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockDoctor);

      const result = await doctorLoginService("doc@example.com");
      expect(result).toEqual(mockDoctor);
    });
  });

  describe("verifyDoctorService", () => {
    it("should verify doctor if code matches", async () => {
      const mockDoctor = {
        doctor_id: 1,
        email: "doc@example.com",
        is_verified: false,
        verification_code: "123456",
      };

      (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockDoctor);

      const result = await verifyDoctorService("doc@example.com", "123456");
      expect(result).toHaveProperty("is_verified", true);
    });

    it("should return null if doctor not found", async () => {
      (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValueOnce(null);

      const result = await verifyDoctorService("nonexistent@example.com", "123456");
      expect(result).toBeNull();
    });

    it("should return null if already verified", async () => {
      const mockDoctor = {
        email: "doc@example.com",
        is_verified: true,
        verification_code: "123456",
      };

      (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockDoctor);

      const result = await verifyDoctorService("doc@example.com", "123456");
      expect(result).toBeNull();
    });

    it("should return null if code does not match", async () => {
      const mockDoctor = {
        email: "doc@example.com",
        is_verified: false,
        verification_code: "654321",
      };

      (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockDoctor);

      const result = await verifyDoctorService("doc@example.com", "123456");
      expect(result).toBeNull();
    });
  });

  describe("getDoctorService", () => {
    it("should return all doctors", async () => {
      const doctors = [{ doctor_id: 1 }, { doctor_id: 2 }];
      (db.query.DoctorsTable.findMany as jest.Mock).mockResolvedValueOnce(doctors);

      const result = await getDoctorService();
      expect(result).toEqual(doctors);
    });
  });

  describe("getDoctorByIdService", () => {
    it("should return doctor by ID", async () => {
      const doctor = { doctor_id: 1 };
      (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValueOnce(doctor);

      const result = await getDoctorByIdService(1);
      expect(result).toEqual(doctor);
    });
  });

  describe("updateDoctorService", () => {
    it("should update and return doctor", async () => {
      const updated = await updateDoctorService(1, { first_name: "Updated" });
      expect(updated).toHaveProperty("doctor_id", 1);
      expect(updated).toHaveProperty("is_verified", true);
    });
  });

  describe("deleteDoctorService", () => {
    it("should delete doctor successfully", async () => {
      const result = await deleteDoctorService(1);
      expect(result).toBe("Doctor deleted successfully");
    });
  });
});
