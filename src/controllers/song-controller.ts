import { Request, Response } from "express";
import { FindOptionsOrder, FindOptionsWhere } from "typeorm";
import { Playlist } from "../entities/playlist";
import { Song } from "../entities/song";
import playlistRepository from "../repositories/playlist-repository";
import songRepository from "../repositories/song-repository";
import { Controller } from "./framework/controller";

export class SongController extends Controller<Song> {

  private constructor() {
    super(songRepository);
  }

  public static getInstance(): SongController {
    return new SongController();
  }

  public async create(request: Request, response: Response) {
    const { playlist_id } = request.body as Song;

    const playlist: Playlist | null = await playlistRepository
      .findOneBy({ id: playlist_id });

    if(request.userId != playlist?.user_id) {
      return response
        .sendStatus(401);
    }

    return super.create(request, response);
  }

  public async list(request: Request, response: Response) {
    try {
      const { playlist_id } = request.params;

      const playlist: Playlist | null = await playlistRepository
        .findOneBy({ id: parseInt(playlist_id) });

      if(!playlist) {
        return response
          .status(404)
          .json("Playlist not found!");
      }

      const data: Song[] = await songRepository.find({
        loadEagerRelations: false,
        where: {
          ...request.query,
          playlist_id: parseInt(playlist_id)
        } as FindOptionsWhere<Song>,
        order: {
          id: "ASC"
        } as FindOptionsOrder<Song>
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

  public async read(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const data: Song | null = await songRepository
        .findOneBy({ id: parseInt(id) } as FindOptionsWhere<Song>);

      if(!data) {
        return response
          .status(404)
          .json("Song not found!");
      }

      const { playlist_id } = data;

      const playlist: Playlist | null = await playlistRepository
        .findOneBy({ id: playlist_id } as FindOptionsWhere<Playlist>)

      if(!playlist) {
        return response
          .status(404)
          .json("Playlist nt found!");
      }

      return response
        .status(200)
        .json(data);
    } catch(e) {
      return response
        .status(400)
        .json("Error while reading: " + e);
    }
  }

  public async update(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const data: Song | null = await songRepository
        .findOneBy({ id: parseInt(id) } as FindOptionsWhere<Song>);

      if(!data) {
        return response
          .status(404)
          .json("Song not found!");
      }

      const { playlist_id } = data;

      const playlist: Playlist | null = await playlistRepository
        .findOneBy({ id: playlist_id } as FindOptionsWhere<Playlist>)

      if(!playlist) {
        return response
          .status(404)
          .json("Playlist not found!");
      }

      if(request.userId != playlist.user_id) {
        return response
          .status(401)
          .json("Unauthorized to update a song from another user's Playlist.");
      }

      const payload: Song = songRepository
        .create(request.body as Song);

      // Assure that id is not included on payload so that
      // no undesired new registers are created
      if(Object.keys(payload).includes("id")) {
        delete payload["id"];
      }

      const updated: Song = songRepository
        .merge(data, payload);

      const result = await songRepository
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

      const data: Song | null = await songRepository
        .findOneBy({ id: parseInt(id) } as FindOptionsWhere<Song>);

      if(!data) {
        return response
          .status(404)
          .json("Song not found!");
      }

      const { playlist_id } = data;

      const playlist: Playlist | null = await playlistRepository
        .findOneBy({ id: playlist_id } as FindOptionsWhere<Playlist>)

      if(!playlist) {
        return response
          .status(404)
          .json("Playlist not found!");
      }

      if(request.userId != playlist.user_id) {
        return response
          .status(401)
          .json("Unauthorized to delete a song from another user's Playlist.");
      }
      await songRepository.remove(data);

      return response
        .status(200)
        .json(data);
    } catch(e) {
      return response
        .status(400)
        .json("Error while reading: " + e);
    }
  }
}