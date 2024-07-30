import dataSource from "../database/postgres/connection";
import { User } from "../entities/User";

const userRepository = dataSource.getRepository(User);

export default userRepository;