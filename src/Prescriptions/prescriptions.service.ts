import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {TIPrescription, PrescriptionsTable, TSPrescription} from "../drizzle/schema";
import prescriptions from "./prescriptions.router";

//create a prescription service
// export const createPrescriptionService = async (prescription: TIPrescription) => {
//     await db.insert(PrescriptionsTable).values(prescription);
//     return "Prescription created successfully";
// };

export const createPrescriptionService = async (prescription: TIPrescription) => {
  const [created] = await db.insert(PrescriptionsTable).values(prescription).returning();
  return created;
};



//get all prescriptions
export const getPrescriptionsService = async () => {
    const prescription = await db.query.PrescriptionsTable.findMany()
    return prescription
}

//get prescriptioin by Id
export const getPrescriptionByIdService = async (id: number) => {
    const prescription = await db.query.PrescriptionsTable.findFirst({
        where:eq(PrescriptionsTable.prescription_id, id)
    })
    return prescription;
}

//update prescriptions 
export const updatePrescriptionsService = async (id: number, data: Partial<TIPrescription>) => {
  const updated = await db
    .update(PrescriptionsTable)
    .set(data)
    .where(eq(PrescriptionsTable.prescription_id, id))
    .returning();
  return updated[0];
};

//delete prescription by id
export const deletePrescriptionsService = async (id: number) => {
     await db.delete(PrescriptionsTable).where(eq(PrescriptionsTable.prescription_id, id))
     return "Prescription deleted successfully";
}

