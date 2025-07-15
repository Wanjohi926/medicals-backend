import { Request, Response } from "express";
import {
  createAppointmentService,
  getAllAppointmentsService,
  getAppointmentByIdService,
  updateAppointmentService,
  deleteAppointmentService
} from "./Appointments.service";

// Post new appointment
export const createAppointmentController = async (req: Request, res: Response) => {
  try {
    const appointment = await createAppointmentService(req.body);
    res.status(201).json({ message: "Appointment created", data: appointment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all appointments
export const getAllAppointmentsController = async (_req: Request, res: Response) => {
  try {
    const appointments = await getAllAppointmentsService();
    res.status(200).json({ data: appointments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get appointment by ID
export const getAppointmentByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const appointment = await getAppointmentByIdService(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json({ data: appointment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update existing appointment
export const updateAppointmentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await updateAppointmentService(id, req.body);

    if (!updated) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json({ message: "Appointment updated", data: updated });
  } catch (error: any) {
    res.status(204).json({ error: error.message });
  }
};

// Delete appointment
export const deleteAppointmentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await deleteAppointmentService(id);

    if (!deleted) return res.status(404).json({ message: "Appointment not found" });

    res.status(204).json({ message: "Appointment deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
