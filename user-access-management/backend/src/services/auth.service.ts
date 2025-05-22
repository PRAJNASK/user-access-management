import { AppDataSource } from "../../ormconfig";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

const userRepo = AppDataSource.getRepository(User);

export const registerUser = async (username: string, password: string) => {
  const existing = await userRepo.findOne({ where: { username } });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);
  const user = userRepo.create({ username, password: hashed, role: "Employee" }); 
  return await userRepo.save(user);
};

export const loginUser = async (username: string, password: string) => {
  const user = await userRepo.findOne({ where: { username } });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  return user;
};
