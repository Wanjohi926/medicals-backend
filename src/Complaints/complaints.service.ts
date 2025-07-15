import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIComplaint, ComplaintsTable } from "../drizzle/schema";

// Create complaint
// export const createComplaintService = async (complaint: TIComplaint) => {
//   await db.insert(ComplaintsTable).values(complaint);
//   return "Complaint created successfully";
// };


// Create complaint service
export const createComplaintService = async (complaint: TIComplaint) => {
  const [created] = await db
    .insert(ComplaintsTable)
    .values(complaint)
    .returning();
  return created;
};


// Get all complaints
export const getComplaintsService = async () => {
  return await db.query.ComplaintsTable.findMany();
};

// Get complaint by ID
export const getComplaintByIdService = async (id: number) => {
  return await db.query.ComplaintsTable.findFirst({
    where: eq(ComplaintsTable.complaint_id, id),
  });
};

// Update complaint
export const updateComplaintService = async (id: number, data: Partial<TIComplaint>) => {
  const updated = await db
    .update(ComplaintsTable)
    .set(data)
    .where(eq(ComplaintsTable.complaint_id, id))
    .returning();
  return updated[0];
};

// Delete complaint
export const deleteComplaintService = async (id: number) => {
  await db.delete(ComplaintsTable).where(eq(ComplaintsTable.complaint_id, id));
  return "Complaint deleted successfully";
};
