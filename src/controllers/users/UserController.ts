import { User } from "../../entities/User";
import userRepository from "../../repositories/UserRepository";
import { Controller } from "./../framework/Controller";

export class UserController extends Controller<User> {

  private constructor() {
    super(userRepository);
  }

  public static getInstance(): UserController {
    return new UserController();
  }
}