import dataSource from "../database/postgres/datasource";
import { Playlist } from "../entities/playlist";

const playlistRepository = dataSource.getRepository(Playlist);

export default playlistRepository;