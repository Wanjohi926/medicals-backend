import { Request, Response } from "express";
import {
  createComplaintService,
  getComplaintsService,
  getComplaintByIdService,
  updateComplaintService,
  deleteComplaintService,
} from "./complaints.service";

// Create
export const createComplaintController = async (req: Request, res: Response) => {
  try {
    const complaint = req.body;
    const result = await createComplaintService(complaint);
    if (!result) return res.status(400).json({ message: "Complaint not created" });
    return res.status(201).json({ message: "Complaint created successfully", complaint: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all
export const getComplaintsController = async (req: Request, res: Response) => {
  try {
    const complaints = await getComplaintsService();
    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found" });
    }
    return res.status(200).json({ data: complaints });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get by ID
export const getComplaintByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const complaint = await getComplaintByIdService(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    return res.status(200).json({ data: complaint });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Update
export const updateComplaintController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const updated = await updateComplaintService(id, req.body);
    if (!updated) return res.status(404).json({ message: "Complaint not found" });

    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete
export const deleteComplaintController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const existingComplaint = await getComplaintByIdService(id);
    if (!existingComplaint) return res.status(404).json({ message: "Complaint not found" });

    const deleted = await deleteComplaintService(id);
    if (!deleted) return res.status(400).json({ message: "Complaint not deleted" });

    return res.status(204).json({ message: "Complaint deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
