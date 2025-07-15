import { Request, Response } from "express";
import {
  createDoctorService,
  verifyDoctorService,
  getDoctorService,
  getDoctorByIdService,
  doctorLoginService,
  updateDoctorService,
  deleteDoctorService,
} from "./doctors.service";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

// Register doctor
export const createDoctorController = async (req: Request, res: Response) => {
  try {
    const doctor = req.body;

    // Hash the password
    doctor.password = await bcrypt.hash(doctor.password, 10);

    // Create doctor
    const result = await createDoctorService(doctor);
    if (!result) {
      return res.status(400).json({ message: "Doctor not created" });
    }

    return res.status(201).json({
      message: "Doctor created successfully. Verification code sent to email.",
      doctor: result,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Verify doctor
export const verifyDoctorController = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const result = await verifyDoctorService(email, code);
    if (!result) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ message: "Doctor verified successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Login doctor
export const loginDoctorController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorLoginService(email);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctor.is_verified) {
      return res.status(403).json({ message: "Please verify your account first." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, doctor.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      sub: doctor.doctor_id,
      doctor_id: doctor.doctor_id,
      email: doctor.email,
      role: "doctor",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
    };

    const secret = process.env.JWT_SECRET as string;
    if (!secret) throw new Error("JWT_SECRET not defined");

    const token = jwt.sign(payload, secret);

    return res.status(200).json({
      message: "Login successful",
      token,
      doctor: {
        doctor_id: doctor.doctor_id,
        email: doctor.email,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all doctors
export const getDoctorController = async (_req: Request, res: Response) => {
  try {
    const doctors = await getDoctorService();
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }
    return res.status(200).json({ data: doctors });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get doctor by ID
export const getDoctorByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const doctor = await getDoctorByIdService(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({ data: doctor });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Update doctor
export const updateDoctorController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const updated = await updateDoctorService(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({ message: "Doctor updated", data: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete doctor
export const deleteDoctorController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const existingDoctor = await getDoctorByIdService(id);
    if (!existingDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const deleted = await deleteDoctorService(id);
    if (!deleted) {
      return res.status(400).json({ message: "Doctor not deleted" });
    }

    return res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
