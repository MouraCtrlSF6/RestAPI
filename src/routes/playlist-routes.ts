import { Request, Response, Router } from "express";
import { PlaylistController } from "../controllers/playlist-controller";

const playlistController: PlaylistController = PlaylistController.getInstance();

const routes = Router();

routes.get("/playlist", async (request: Request, response: Response) => {

  return await playlistController.list(request, response);
});
routes.get("/playlist/:id", async (request: Request, response: Response) => {
  return await playlistController.read(request, response);
});
routes.post("/playlist", async (request: Request, response: Response) => {
  return await playlistController.create(request, response);
});
routes.put("/playlist/:id", async (request: Request, response: Response) => {
  return await playlistController.update(request, response);
});
routes.delete("/playlist/:id", async (request: Request, response: Response) => {
  return await playlistController.delete(request, response);
});

export default routes;