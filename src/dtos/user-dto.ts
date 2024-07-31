import { User } from "../entities/user";

export class UserDto {

  id: number | undefined;

  name: string | undefined;

  email: string | undefined;

  public static toDto(entity: User): UserDto {
    const dto = new UserDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.email = entity.email;

    return dto;
  }
}