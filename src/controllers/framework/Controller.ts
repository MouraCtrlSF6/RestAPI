import { Request, Response } from "express";
import { FindOptionsOrder, FindOptionsWhere, FindOptionsWhereProperty, ObjectLiteral, Repository } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { IController } from "./icontroller";

export class Controller<Entity extends ObjectLiteral> implements IController {

  protected constructor(
    protected readonly repository: Repository<Entity>
  ) {}

  public async create(request: Request, response: Response) {
    try {

      const entity: Entity = this.repository.create(request.body as Entity);

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
      const idColumn: ColumnMetadata = this.getIdColumn();

      const { [idColumn.propertyName]: dataId } = request.params;

      const data: Entity | null = await this.repository
        .findOneBy({
          [idColumn.propertyName]: dataId
        } as FindOptionsWhere<Entity>);

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
      const idColumn: ColumnMetadata = this.getIdColumn();

      const { [idColumn.propertyName]: dataId } = request.params;

      const register: Entity | null = await this.repository
        .findOne({
          loadEagerRelations: false,
          where: { [idColumn.propertyName]: dataId } as FindOptionsWhere<Entity>
        });

      if(!register) {
        return response
          .sendStatus(404);
      }

      const payload: Entity = this.repository
        .create(request.body as Entity);

      // Assure that id is not included on payload so that
      // no undesired new registers are created
      if(Object.keys(payload).includes(idColumn.propertyName)) {
        delete payload[idColumn.propertyName];
      }

      const updated: Entity = this.repository
        .merge(register, payload);

      const result = await this.repository
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
      const data: Entity[] = await this.repository.find({
        loadEagerRelations: false,
        where: {
          ...request.query as Entity
        } as FindOptionsWhere<Entity>,
        order: {
          [this.getIdColumn().propertyName]: "ASC"
        } as FindOptionsOrder<Entity>
      });

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

  private getIdColumn(): ColumnMetadata {
    const { primaryColumns } = this.repository.metadata;

    const idColumn: ColumnMetadata = primaryColumns
      .find((value: ColumnMetadata) => value.isObjectId) || primaryColumns[0];

    return idColumn;
  }
}