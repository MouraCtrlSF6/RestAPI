import dataSource from "../database/postgres/datasource";
import { User } from "../entities/user";

const userRepository = dataSource.getRepository(User);

export default userRepository;