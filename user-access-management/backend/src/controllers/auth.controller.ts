import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { generateToken } from "../utils/generateToken";

export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await registerUser(username, password); // Corrected: registerUser in auth.service.ts handles role assignment
    const token = generateToken(user.id, user.role);
    res.json({ token, role: user.role });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await loginUser(username, password);
    const token = generateToken(user.id, user.role);
    res.json({ token, role: user.role });
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ message: err.message });
    } else {
      res.status(401).json({ message: "Something went wrong" });
    }
  }
};

