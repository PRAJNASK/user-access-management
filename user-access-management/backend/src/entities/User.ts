import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export type UserRole = "Employee" | "Manager" | "Admin";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ type: "varchar" })
  role!: UserRole;
}
