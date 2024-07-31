import { Router } from "express";
import authMiddleware from "./middlewares/auth-middleware";
import authRoutes from "./routes/auth-routes";
import playlistRoutes from "./routes/playlist-routes";
import songRoutes from "./routes/song-routes";
import userRoutes from "./routes/user-routes";

const routes = Router();

routes.use(authRoutes)
routes.use(userRoutes);
routes.use(authMiddleware, playlistRoutes);
routes.use(authMiddleware, songRoutes);


export default routes;
