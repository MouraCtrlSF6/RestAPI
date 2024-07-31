import { config } from "dotenv";
import { DataSource } from "typeorm";

config();

const port: number = (process.env.DB_PORT || 5432) as number;

export default new DataSource({
  type: "postgres",
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  host: process.env.DB_HOST,
  port,
  entities: [`src/entities/*.{ts,js}`],
  migrations: [`src/database/postgres/migrations/*.{ts,js}`],
})
