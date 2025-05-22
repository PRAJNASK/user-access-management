import { Request, Response } from "express";
import { AppDataSource } from "../../ormconfig";
import { Software } from "../entities/Software";

const softwareRepo = AppDataSource.getRepository(Software);

export const createSoftware = async (req: Request, res: Response): Promise<void> => {
  const { name, description, accessLevels } = req.body;

  if (!name || !description || !Array.isArray(accessLevels)) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  try {
    const software = softwareRepo.create({ name, description, accessLevels });
    const saved = await softwareRepo.save(software);
    res.status(201).json(saved);
    return;
  } catch (err) {
    res.status(500).json({ message: "Error creating software" });
    return;
  }
};

export const getAllSoftware = async (_req: Request, res: Response): Promise<void> => {
  try {
    const list = await softwareRepo.find();
    res.json(list);
    return;
  } catch (err) {
    res.status(500).json({ message: "Error fetching software list" });
    return;
  }
};
