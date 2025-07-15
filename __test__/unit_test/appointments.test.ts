import { createAppointmentService, getAllAppointmentsService, getAppointmentByIdService, updateAppointmentService, deleteAppointmentService } from "../../src/Appointments/Appointments.service";
import { AppointmentsTable } from "../../src/drizzle/schema";

jest.mock("../../src/drizzle/db", () => {
  return {
    __esModule: true,
    default: {
      insert: jest.fn(() => ({
        values: jest.fn().mockResolvedValue(undefined),
      })),
      select: jest.fn(() => ({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([{ appointment_id: 1 }]),
      })),
      update: jest.fn(() => ({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([{ appointment_id: 1, status: "Updated" }]),
      })),
      delete: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([{ appointment_id: 1 }]),
      })),
    },
  };
});

import db from "../../src/drizzle/db";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Appointments Service", () => {
  describe("createAppointmentService", () => {
    it("should insert and return appointment", async () => {
      const appointment = {
        user_id: 1,
        doctor_id: 2,
        appointment_date: "2025-07-15",
        time_slot: "09:00AM - 10:00AM",
        total_amount: 5000,
        appointment_status: "Pending" as "Pending",
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await createAppointmentService(appointment);
      expect(db.insert).toHaveBeenCalledWith(AppointmentsTable);
      expect(result).toEqual(appointment);
    });
  });

  describe("getAllAppointmentsService", () => {
    it("should return all appointments", async () => {
      const selectMock = db.select as jest.Mock;
      selectMock.mockReturnValueOnce({
        from: jest.fn().mockResolvedValue([
          { appointment_id: 1 },
          { appointment_id: 2 },
        ]),
      });

      const result = await getAllAppointmentsService();
      expect(result).toEqual([
        { appointment_id: 1 },
        { appointment_id: 2 },
      ]);
    });
  });

  describe("getAppointmentByIdService", () => {
    it("should return one appointment by ID", async () => {
      const selectMock = db.select as jest.Mock;
      selectMock.mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{ appointment_id: 1 }]),
        }),
      });

      const result = await getAppointmentByIdService(1);
      expect(result).toEqual({ appointment_id: 1 });
    });
  });

  describe("updateAppointmentService", () => {
    it("should update and return updated appointment", async () => {
      const result = await updateAppointmentService(1, {
        appointment_status: "Pending",
      });

      expect(result).toEqual({
        appointment_id: 1,
        status: "Updated",
      });
    });
  });

  describe("deleteAppointmentService", () => {
    it("should delete and return deleted appointment", async () => {
      const result = await deleteAppointmentService(1);
      expect(result).toEqual({ appointment_id: 1 });
    });
  });
});
