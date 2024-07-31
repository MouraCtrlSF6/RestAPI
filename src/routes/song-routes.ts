import { Request, Response, Router } from "express";
import { SongController } from "../controllers/song-controller";

const songController: SongController = SongController.getInstance();

const routes = Router();

routes.get("/song/:playlist_id", async (request: Request, response: Response) => {
  return await songController.list(request, response);
});
routes.get("/song/details/:id", async (request: Request, response: Response) => {
  return await songController.read(request, response);
});
routes.post("/song", async (request: Request, response: Response) => {
  return await songController.create(request, response);
});
routes.put("/song/:id", async (request: Request, response: Response) => {
  return await songController.update(request, response);
});
routes.delete("/song/:id", async (request: Request, response: Response) => {
  return await songController.delete(request, response);
});

export default routes;