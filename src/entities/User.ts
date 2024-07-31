import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Playlist } from "./playlist";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "text", nullable: false })
  name!: string;

  @Column({ type: "text", nullable: false, unique: true })
  email!: string;

  @Column({ type: "text", nullable: false })
  password!: string;

  @OneToMany(() => Playlist, playlist => playlist.user, { onDelete: "CASCADE", eager: true })
  playlists: Playlist[] | undefined

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", update: false })
  created_at: Date | undefined;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date | undefined;
}