import express, { Application } from "express";
import todoRoutes from "../modules/todo/routes";
import { HttpErrorException } from "../exceptions/http-error.exception";
import { httpErrorHandlerMiddleware } from "../middlewares/http-error-handler.middleware";

export default function generateServer(): Application {
  const app: Application = express();
  app.use(express.json());

  app.use("/api/v1/todo", todoRoutes);

  app.all("*", () => {
    throw HttpErrorException.NotFound();
  });

  app.use(httpErrorHandlerMiddleware);

  return app;
}
