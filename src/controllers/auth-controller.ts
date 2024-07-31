import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/user";
import userRepository from "../repositories/user-repository";

export class AuthController {
  public async authenticate(request: Request, response: Response) {
    try {

      const { email, password } = request.body;

      const user: User | null = await userRepository
        .findOneBy({ email });

      if(!user) {
        return response
          .status(404)
          .json("User not found!");
      }

      const isValidPassword: boolean = await bcrypt
        .compare(password, user.password);

      if(!isValidPassword) {
        return response
          .sendStatus(401);
      }

      const token: string = jwt
        .sign({ id: user.id }, "secret", { expiresIn: "1d" });

      return response
        .status(200)
        .json(token);
    } catch(e) {
      return response
        .status(400)
        .json("Error while trying to authenticate: " + e);
    }
  }

  public static getInstance(): AuthController {
    return new AuthController();
  }
}