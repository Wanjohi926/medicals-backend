import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import { PaymentsTable, TIPayment } from "../drizzle/schema";

// Create payment
export const createPaymentService = async (payment: TIPayment) => {
  const [created] = await db.insert(PaymentsTable).values(payment).returning();
  return created;
};


// Get all payments
export const getAllPaymentsService = async () => {
  return await db.query.PaymentsTable.findMany();
};

// Get payment by ID
export const getPaymentByIdService = async (id: number) => {                                                        
  const result = await db.select().from(PaymentsTable).where(eq(PaymentsTable.payment_id, id));
  return result[0];
};


// Update payment
export const updatePaymentService = async (id: number, data: Partial<TIPayment>) => {
  const result = await db.update(PaymentsTable).set(data).where(eq(PaymentsTable.payment_id, id)).returning();
  return result[0];
};

// Delete payment
export const deletePaymentService = async (id: number) => {
  const result = await db.delete(PaymentsTable).where(eq(PaymentsTable.payment_id, id)).returning();
  return result[0];
};
