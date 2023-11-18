import express from "express";
import { router } from "./routes";
import { env } from "./config/env";

const app = express();

app.use(express.json());

app.use(router);

app.listen(env.PORT, () => console.log(`App listening on port ${env.PORT}`));
