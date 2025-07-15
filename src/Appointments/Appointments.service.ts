import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import { AppointmentsTable, TIAppointment } from "../drizzle/schema";

// Create an appointment
export const createAppointmentService = async (appointment: TIAppointment) => {
  const [created] = await db
    .insert(AppointmentsTable)
    .values(appointment)
    .returning(); 
  return created;
};

// Get all appointments
export const getAllAppointmentsService = async () => {
  return await db.select().from(AppointmentsTable);
};

// Get appointment by ID
export const getAppointmentByIdService = async (id: number) => {
  const result = await db
    .select()
    .from(AppointmentsTable)
    .where(eq(AppointmentsTable.appointment_id, id));
  return result[0];
};

// Update appointment
export const updateAppointmentService = async (id: number, data: Partial<TIAppointment>) => {
  const result = await db
    .update(AppointmentsTable)
    .set(data)
    .where(eq(AppointmentsTable.appointment_id, id))
    .returning();
  return result[0];
};

// Delete appointment
export const deleteAppointmentService = async (id: number) => {
  const result = await db
    .delete(AppointmentsTable)
    .where(eq(AppointmentsTable.appointment_id, id))
    .returning();
  return result[0];
};
