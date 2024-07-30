import { Request, Response } from "express";
import { FindOptionsWhereProperty, ObjectLiteral, Repository } from "typeorm";
import { IController } from "./IController";

export class Controller<Entity extends ObjectLiteral> implements IController {

  protected constructor(
    protected readonly repository: Repository<Entity>
  ) {}

  public async create(request: Request, response: Response) {
    try {
      const bodyData: Entity = request.body;

      const entity: Entity = this.repository.create(bodyData);

      const data = await this.repository.save(entity);

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
      const { id: dataId } = request.params;

      const data: Entity | null = await this.repository
        .findOneBy(
          { id: dataId as FindOptionsWhereProperty<NonNullable<Entity[string]>> }
        );

      if(!data) {
        return response
          .sendStatus(404);
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

      const { id: dataId } = request.params;

      const register: Entity | null = await this.repository
        .findOneBy(
          { id: dataId as FindOptionsWhereProperty<NonNullable<Entity[string]>> }
        );

      if(!register) {
        return response
          .sendStatus(404);
      }

      const updatedData: Entity = request.body;

      const entityFields = Object.keys(register);

      const updatedFields = Object.keys(updatedData)

      for (let updatedField of updatedFields) {
        if(!entityFields.includes(updatedField)) {
          throw `Invalid field ${updatedField}`;
        }
      }

      if(updatedFields.includes("id")) {
        delete updatedData["id"];
      }

      Object.assign(register, updatedData);

      const result = await this.repository.save(register)

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
      const { id: dataId } = request.params;

      const data: Entity | null = await this.repository
        .findOneBy(
          { id: dataId as FindOptionsWhereProperty<NonNullable<Entity[string]>> }
        );

      if(!data) {
        return response
          .sendStatus(404);
      }

      await this.repository.remove(data);

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
      const data: Entity[] = await this.repository.find();

      if(!data || data.length == 0) {
        return response
          .sendStatus(404);
      }

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