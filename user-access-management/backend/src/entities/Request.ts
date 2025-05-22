import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "./User";
import { Software } from "./Software";

export type AccessType = "Read" | "Write" | "Admin";
export type RequestStatus = "Pending" | "Approved" | "Rejected";

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  user!: User;

  @ManyToOne(() => Software, { eager: true })
  software!: Software;

  @Column({ type: "varchar" })
  accessType!: AccessType;

  @Column("text")
  reason!: string;

  @Column({ type: "varchar", default: "Pending" })
  status!: RequestStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
