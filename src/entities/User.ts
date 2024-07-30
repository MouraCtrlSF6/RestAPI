import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "text", nullable: false })
  name: string | undefined;

  @Column({ type: "text", nullable: false })
  email: string | undefined;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", update: false })
  created_at: Date | undefined;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date | undefined;
}