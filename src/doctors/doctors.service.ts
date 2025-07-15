import { eq } from "drizzle-orm"
import db from "../drizzle/db"
import { TIDoctor, DoctorsTable } from "../drizzle/schema"
import { sql } from "drizzle-orm";
import doctor from "./doctors.router";


//create doctor service
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() *900000).toString();
}

// export const createDoctorService = async (doctor: TIDoctor) => {
//   await db.insert(DoctorsTable).values(doctor);
//   return "Doctor created successfully";
// };



export const createDoctorService = async (doctor: TIDoctor) => {
  const verificationCode = generateVerificationCode();

  const [createdDoctor] = await db
    .insert(DoctorsTable)
    .values({
      ...doctor,
      is_verified: false,
      verification_code: verificationCode
    })
    .returning();

  return createdDoctor;
};

export const doctorLoginService = async (email: string) => {
  return await db.query.DoctorsTable.findFirst({
    columns: {
      doctor_id: true,
      email: true,
      password: true,
      is_verified: true
    },
    where: eq(DoctorsTable.email, email)
  });
};

//verify doctor
export const verifyDoctorService = async (email: string, code: string) => {
  const doctor = await db.query.DoctorsTable.findFirst({
    where: eq(DoctorsTable.email, email)
  });

  // Fail if not found, already verified, or code mismatch
  if (!doctor || doctor.is_verified || doctor.verification_code !== code) {
    return null;
  }

  // Update doctor to verified
  const [updated] = await db.update(DoctorsTable)
    .set({ is_verified: true, verification_code: null })
    .where(eq(DoctorsTable.email, email))
    .returning();

  return updated;
};

//get all doctors service
export const getDoctorService = async () => {
  return await db.query.DoctorsTable.findMany();
};

// Get complaint by ID
export const getDoctorByIdService = async (id: number) => {
  const doctor = await db.query.DoctorsTable.findFirst({
    where: eq(DoctorsTable.doctor_id, id),
  });

  return doctor;
};

// Update a doctor
export const updateDoctorService = async (id: number, data: Partial<TIDoctor>) => {
  const updated = await db
    .update(DoctorsTable)
    .set(data)
    .where(eq(DoctorsTable.doctor_id, id))
    .returning();
  return updated[0];
};

// Delete doctor
export const deleteDoctorService = async (id: number) => {
  await db.delete(DoctorsTable).where(eq(DoctorsTable.doctor_id, id));
  return "Doctor deleted successfully";
};
