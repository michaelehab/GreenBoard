import dotenv from "dotenv";
import express, { Application, Request, Response, NextFunction } from "express";
import { loggerMiddleWare } from "./middlewares/loggerMiddleware";
import routes from "./routes";
import http from "http";
import { db, initDb } from "./datastore";

export const createServer = async (dbPath: string, logRequests: boolean) => {
  await initDb(dbPath);
  dotenv.config();

  const app: Application = express();
  app.use(express.json());
  if (logRequests) app.use(loggerMiddleWare);

  app.get("/healthz", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ status: "OK" });
  });

  app.use("/api/v1", routes);

  return http.createServer(app);
};
