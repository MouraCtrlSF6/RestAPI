import { config } from "dotenv";
import app from "./config/systemConfiguration";
import dataSource from "./database/postgres/connection";

config();

const port: number = (process.env.PORT || 3000) as number;

dataSource
  .initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on PORT ${port}`);
    })
  }).catch((err) => {
    console.error(`Error on establishing connection with database: ${err}`);
  })