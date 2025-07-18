import { text, varchar,pgEnum, timestamp, serial, pgTable, decimal, integer, boolean, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const RoleEnum = pgEnum("role", ["user", "admin", "doctor"]);
export const AppointmentStatusEnum = pgEnum("appointment_status", ["Pending", "Confirmed", "Cancelled"]);
export const ComplaintStatusEnum = pgEnum("complaint_status", ["Open", "In Progress", "Resolved", "Closed"]);

// Users Table
export const UsersTable = pgTable("users", {
  user_id: serial("user_id").primaryKey(),
  first_name: varchar("first_name", { length: 100 }).notNull(),
  last_name: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  contact_phone: varchar("contact_phone", { length: 20 }),
  address: varchar("address", { length: 255 }),
  role: RoleEnum("role").default("user"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  is_verified: boolean("is_verified").default(false),
  verification_code: varchar("verification_code", { length: 6 })
});

// Doctors Table
export const DoctorsTable = pgTable("doctors", {
  doctor_id: serial("doctor_id").primaryKey(),
  first_name: varchar("first_name", { length: 100 }).notNull(),
  last_name: varchar("last_name", { length: 100 }).notNull(),
  specialization: varchar("specialization", { length: 100 }).notNull(),
  email: varchar("email",{length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  contact_phone: varchar("contact_phone", { length: 20 }),
  available_days: text("available_days"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  is_verified: boolean("is_verified").default(false),
  verification_code: varchar("verification_code", { length: 6 }),
  role: RoleEnum("role").default("doctor").notNull(), 
});

// Appointments Table
export const AppointmentsTable = pgTable("appointments", {
  appointment_id: serial("appointment_id").primaryKey(),
  user_id: integer("user_id").references(() => UsersTable.user_id, { onDelete: "cascade" }).notNull(),
  doctor_id: integer("doctor_id").references(() => DoctorsTable.doctor_id, { onDelete: "cascade" }).notNull(),
  appointment_date: date("appointment_date").notNull(),
  time_slot: varchar("time_slot", { length: 50 }).notNull(),
  total_amount: integer("total_amount"),
  appointment_status: AppointmentStatusEnum("appointment_status").default("Pending"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});


// Prescriptions Table
export const PrescriptionsTable = pgTable("prescriptions", {
  prescription_id: serial("prescription_id").primaryKey(),
  appointment_id: integer("appointment_id").references(() => AppointmentsTable.appointment_id, { onDelete: "cascade" }).notNull(),
  doctor_id: integer("doctor_id").references(() => DoctorsTable.doctor_id, { onDelete: "cascade" }).notNull(),
  patient_id: integer("patient_id").references(() => UsersTable.user_id, { onDelete: "cascade" }).notNull(),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Payments Table
export const PaymentsTable = pgTable("payments", {
  payment_id: serial("payment_id").primaryKey(),
  appointment_id: integer("appointment_id").references(() => AppointmentsTable.appointment_id, { onDelete: "cascade" }).notNull(),
  amount: integer("amount").notNull(),
  transaction_id: varchar("transaction_id", { length: 100 }),
  payment_status: varchar("payment_status", { length: 50 }).default("Pending"),
  payment_date: timestamp("payment_date").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Complaints Table
export const ComplaintsTable = pgTable("complaints", {
  complaint_id: serial("complaint_id").primaryKey(),
  user_id: integer("user_id").references(() => UsersTable.user_id, { onDelete: "cascade" }).notNull(),
  related_appointment_id: integer("related_appointment_id").references(() => AppointmentsTable.appointment_id, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 200 }).notNull(),
  description: text("description"),
  status: ComplaintStatusEnum("complaint_status").default("Open"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

//relationships
export const UserRelations = relations(UsersTable, ({ many }) => ({
  appointments: many(AppointmentsTable),
  prescriptions: many(PrescriptionsTable),
  complaints: many(ComplaintsTable)
}));

export const DoctorRelations = relations(DoctorsTable, ({ many }) => ({
  appointments: many(AppointmentsTable),
  prescriptions: many(PrescriptionsTable)
}));

export const AppointmentRelations = relations(AppointmentsTable, ({ one, many }) => ({
  user: one(UsersTable, {
    fields: [AppointmentsTable.user_id],
    references: [UsersTable.user_id]
  }),
  doctor: one(DoctorsTable, {
    fields: [AppointmentsTable.doctor_id],
    references: [DoctorsTable.doctor_id]
  }),
  prescriptions: many(PrescriptionsTable),
  payments: many(PaymentsTable),
  complaints: many(ComplaintsTable)
}));

export const PrescriptionRelations = relations(PrescriptionsTable, ({ one }) => ({
  doctor: one(DoctorsTable, {
    fields: [PrescriptionsTable.doctor_id],
    references: [DoctorsTable.doctor_id]
  }),
  patient: one(UsersTable, {
    fields: [PrescriptionsTable.patient_id],
    references: [UsersTable.user_id]
  }),
  appointment: one(AppointmentsTable, {
    fields: [PrescriptionsTable.appointment_id],
    references: [AppointmentsTable.appointment_id]
  })
}));

export const PaymentRelations = relations(PaymentsTable, ({ one }) => ({
  appointment: one(AppointmentsTable, {
    fields: [PaymentsTable.appointment_id],
    references: [AppointmentsTable.appointment_id]
  })
}));

export const ComplaintRelations = relations(ComplaintsTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [ComplaintsTable.user_id],
    references: [UsersTable.user_id]
  }),
  appointment: one(AppointmentsTable, {
    fields: [ComplaintsTable.related_appointment_id],
    references: [AppointmentsTable.appointment_id]
  })
}));

export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;

export type TIDoctor = typeof DoctorsTable.$inferInsert;
export type TSDoctor = typeof DoctorsTable.$inferSelect;

export type TIAppointment = typeof AppointmentsTable.$inferInsert;
export type TSAppointment = typeof AppointmentsTable.$inferSelect;

export type TIPrescription = typeof PrescriptionsTable.$inferInsert;
export type TSPrescription = typeof PrescriptionsTable.$inferSelect;

export type TIPayment = typeof PaymentsTable.$inferInsert;
export type TSPayment = typeof PaymentsTable.$inferSelect;

export type TIComplaint = typeof ComplaintsTable.$inferInsert;
export type TSComplaint = typeof ComplaintsTable.$inferSelect;
