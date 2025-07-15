import { Request, Response } from "express";
import { createUserService, verifyUserService, getUserService, getUserByIdService, userLoginService, updateUserService, deleteUserService } from "./users.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = req.body;

    user.password = await bcrypt.hash(user.password, 10);

    const result = await createUserService(user);
    if (!result) return res.status(400).json({ message: "User not created" });
    return res.status(201).json({ message: "User created successfully,Verification code sent to Email", user: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const verifyUserController = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const result = await verifyUserService(email, code);

    if (!result) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userLoginService(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.is_verified) {
      return res.status(403).json({ message: "Please verify your account first." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      sub: user.user_id,
      user_id: user.user_id,
      email: user.email,
      role: "user",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
    };

    const secret = process.env.JWT_SECRET as string;
    if (!secret) throw new Error("JWT_SECRET not defined");

    const token = jwt.sign(payload, secret);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        email: user.email
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserController = async (req: Request, res: Response) => {
  try {
    const user = await getUserService();
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ data: user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const user = await getUserByIdService(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ data: user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const updated = await updateUserService(id, req.body);
    if (!updated) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const existingUser = await getUserByIdService(id);
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    const deleted = await deleteUserService(id);
    if (!deleted) return res.status(400).json({ message: "User not deleted" });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
