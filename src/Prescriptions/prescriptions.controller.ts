import { Request, Response } from "express";
import { createPrescriptionService, getPrescriptionsService, getPrescriptionByIdService, updatePrescriptionsService, deletePrescriptionsService } from "./prescriptions.service";

// Create prescription controller
export const createPrescriptionController = async (req: Request, res: Response) => {
  try {
    const prescription = req.body;

    const newPrescription = await createPrescriptionService(prescription);
    if (!newPrescription) {
      return res.status(400).json({ message: "Prescription not created" });
    }
    return res.status(201).json({ message: "Prescription created successfully", data: newPrescription });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all prescriptions controller
export const getPrescriptionsController = async (req: Request, res: Response) => {
  try {
    const prescriptions = await getPrescriptionsService();
    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found" });
    }
    return res.status(200).json({ data: prescriptions });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get prescription by ID controller
export const getPrescriptionByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const prescription = await getPrescriptionByIdService(id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    return res.status(200).json({ data: prescription });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Update prescription controller
export const updatePrescriptionController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const updated = await updatePrescriptionsService(id, req.body);
    if (!updated) return res.status(404).json({ message: "Prescription not found" });

    return res.status(200).json({ message: "Prescription updated successfully", data: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete prescription controller
export const deletePrescriptionController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const prescription = await getPrescriptionByIdService(id);
    if (!prescription) return res.status(404).json({ message: "Prescription not found" });

    const deleted = await deletePrescriptionsService(id);
    if (!deleted) return res.status(400).json({ message: "Prescription not deleted" });

    return res.status(204).json({ message: "Prescription deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
