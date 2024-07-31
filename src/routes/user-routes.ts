import { Request, Response, Router } from "express";
import { UserController } from "../controllers/user-controller";

const userController: UserController = UserController.getInstance();

const routes = Router();

routes.get("/users", async (request: Request, response: Response) => {
  return await userController.list(request, response);
});
routes.get("/users/:id", async (request: Request, response: Response) => {
  return await userController.read(request, response);
});
routes.post("/users", async (request: Request, response: Response) => {
  return await userController.create(request, response);
});
routes.put("/users/:id", async (request: Request, response: Response) => {
  return await userController.update(request, response);
});
routes.delete("/users/:id", async (request: Request, response: Response) => {
  return await userController.delete(request, response);
});

export default routes;