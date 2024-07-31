import { Request, Response, Router } from "express";
import { AuthController } from "../controllers/auth-controller";

const authController: AuthController = AuthController.getInstance();

const routes = Router();

routes.get("/auth", async (request: Request, response: Response) => {
  return await authController.authenticate(request, response);
});

export default routes;