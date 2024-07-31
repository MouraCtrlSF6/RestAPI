import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { FindOptionsOrder, FindOptionsWhere } from "typeorm";
import { UserDto } from "../dtos/user-dto";
import { User } from "../entities/user";
import userRepository from "../repositories/user-repository";
import { Controller } from "./framework/controller";

export class UserController extends Controller<User> {

  private constructor() {
    super(userRepository);
  }

  public static getInstance(): UserController {
    return new UserController();
  }

  public async create(request: Request, response: Response) {
    try {

      const entity: User = userRepository.create(request.body as User);

      entity.password = await bcrypt.hash(entity.password, 8);

      const data: User = await this.repository.save(entity);

      data.password = "";

      return response
        .status(201)
        .json(data);
    } catch(e) {
      return response
        .status(400)
        .json("Error while creating: " + e);
    }
  }

  public async read(request: Request, response: Response) {
    try {

      const { id: userId } = request.params;

      if(request.userId != parseInt(userId)) {
        return response
          .status(401)
          .json("Unauthorized to search for another User's personal information.");
      }

      const data: User | null = await this.repository
        .findOneBy({ id: parseInt(userId) } as FindOptionsWhere<User>);

      if(!data) {
        return response
          .status(404)
          .json("User not found!");
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

  public async list(request: Request, response: Response) {
    try {
      const data: User[] = await userRepository.find({
        loadEagerRelations: false,
        where: {
          ...request.query,
        } as FindOptionsWhere<User>,
        order: {
          id: "ASC"
        } as FindOptionsOrder<User>
      });

      const payload: UserDto[] = data.map((entity: User) => {
        return UserDto.toDto(entity);
      })

      return response
        .status(200)
        .json(payload);
    } catch(e) {
      return response
        .status(400)
        .json("Error while trying to list Users: " + e);
    }
  }
}