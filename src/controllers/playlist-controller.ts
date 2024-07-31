import { Request, Response } from "express";
import { FindOptionsOrder, FindOptionsWhere } from "typeorm";
import { Playlist } from "../entities/playlist";
import playlistRepository from "../repositories/playlist-repository";
import { Controller } from "./framework/controller";

export class PlaylistController extends Controller<Playlist> {

  private constructor() {
    super(playlistRepository);
  }

  public static getInstance(): PlaylistController {
    return new PlaylistController();
  }

  public async create(request: Request, response: Response) {
    const { user_id } = request.body as Playlist;

    if(request.userId != user_id) {
      return response
        .status(401)
        .json("Unauthorized to create a new Playlist for another user.");
    }

    return super.create(request, response);
  }

  public async update(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const register: Playlist | null = await playlistRepository
        .findOneBy({ id: parseInt(id) } as FindOptionsWhere<Playlist>);

      if(!register) {
        return response
          .status(404)
          .json("Playlist not found!");
      }

      if(request.userId != register.user_id) {
        return response
          .status(401)
          .json("Unauthorized to update another user's Playlist.")
      }

      const payload: Playlist = playlistRepository
        .create(request.body as Playlist);

      // Assure that id is not included on payload so that
      // no undesired new registers are created
      if(Object.keys(payload).includes("id")) {
        delete payload["id"];
      }

      const updated: Playlist = playlistRepository
        .merge(register, payload);

      const result = await playlistRepository
        .save(updated)

      return response
        .status(200)
        .json(result);

    } catch(e) {
      return response
        .status(400)
        .json("Error while updating: " + e);
    }
  }

  public async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const data: Playlist | null = await playlistRepository
        .findOneBy({ id: parseInt(id) } as FindOptionsWhere<Playlist>);

      if(!data) {
        return response
          .status(404)
          .json("Playlist not found!");
      }

      if(request.userId != data.user_id) {
        return response
          .status(401)
          .json("Unauthorized to delete another user's Playlist.");
      }

      await playlistRepository.remove(data);

      return response
        .status(200)
        .json(data);
    } catch(e) {
      return response
        .status(400)
        .json("Error while reading: " + e);
    }
  }

  public async list(request: Request, response: Response) {
    try {
      const data: Playlist[] = await playlistRepository.find({
        loadEagerRelations: false,
        where: {
          ...request.query,
          user_id: request.userId
        } as FindOptionsWhere<Playlist>,
        order: {
          id: "ASC"
        } as FindOptionsOrder<Playlist>
      });

      return response
        .status(200)
        .json(data);
    } catch(e) {
      return response
        .status(400)
        .json("Error while listing: " + e);
    }
  }
}