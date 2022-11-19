import express, { Application, Request, Response, NextFunction } from "express";
import routes from "./routes";

export default function createServer() {
  const app: Application = express();

  app.get("/healthz", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ status: "OK" });
  });

  app.use("/api/v1", routes);

  return app;
}
