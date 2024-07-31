import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Playlist } from "./playlist";

@Entity("songs")
export class Song {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "text", nullable: false })
  name!: string;

  @Column({ type: "text", nullable: false })
  link!: string;

  @Column({ type: "int", nullable: false })
  playlist_id!: number;

  @ManyToOne(() => Playlist, playlist => playlist.songs, { nullable: false })
  @JoinColumn({ name: "playlist_id", referencedColumnName: "id" })
  playlist!: Playlist;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", update: false, readonly: true })
  created_at: Date | undefined;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date | undefined;
}