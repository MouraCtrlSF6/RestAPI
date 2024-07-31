import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Song } from "./song";
import { User } from "./user";

@Entity("playlists")
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "text", nullable: false })
  playlist!: string;

  @OneToMany(() => Song, song => song.playlist, { onDelete: "CASCADE", eager: true })
  songs: Song[] | undefined;

  @Column({ type: "int", nullable: false })
  user_id!: number;

  @ManyToOne(() => User, user => user.playlists, { nullable: false })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user!: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", update: false })
  created_at: Date | undefined;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date | undefined;
}