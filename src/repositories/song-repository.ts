import dataSource from "../database/postgres/datasource";
import { Song } from "../entities/song";

const songRepository = dataSource.getRepository(Song);

export default songRepository;