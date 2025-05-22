import { DataSource } from "typeorm";
import { User } from "./src/entities/User";
import { Software } from "./src/entities/Software";
import { Request } from "./src/entities/Request";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Software, Request],
  synchronize: true,
  logging: true, // Changed from false to true
});
