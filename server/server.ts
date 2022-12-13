import dotenv from "dotenv";
import express, { Application, Request, Response, NextFunction } from "express";
import { loggerMiddleWare } from "./middlewares/loggerMiddleware";
import routes from "./routes";
import { initDb } from "./datastore";
import path from "path";

export const createServer = async (dbPath: string, logRequests: boolean) => {
  dotenv.config({ path: path.join(__dirname, ".env") });

  await initDb(dbPath);

  const app: Application = express();
  app.use(express.json());
  if (logRequests) app.use(loggerMiddleWare);

  app.get("/healthz", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ status: "OK" });
  });

  app.use("/api/v1", routes);

  return app;
};
