import { Request, Response } from "express";
import {
  createPaymentService,
  getAllPaymentsService,
  getPaymentByIdService,
  updatePaymentService,
  deletePaymentService
} from "./payments.services";

// Create
export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const payment = await createPaymentService(req.body);
    res.status(201).json({ message: "Payment created", data: payment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//get all payments
export const getAllPaymentsController = async (_req: Request, res: Response) => {
  try {
    const payments = await getAllPaymentsService();
    res.status(200).json({ data: payments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//get payment by id
export const getPaymentByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const payment = await getPaymentByIdService(id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ data: payment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update payment
export const updatePaymentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await updatePaymentService(id, req.body);

    if (!updated) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ message: "Payment updated", data: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete payment
export const deletePaymentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await deletePaymentService(id);

    if (!deleted) return res.status(404).json({ message: "Payment not found" });

    res.status(204).json({ message: "Payment deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
