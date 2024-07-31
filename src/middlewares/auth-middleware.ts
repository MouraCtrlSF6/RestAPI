import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: number
}

export default function authMiddleware(request: Request, response: Response, next: NextFunction) {
  try {
    const { authorization } = request.headers;

    if(!authorization) {
      return response
        .sendStatus(401);
    }

    const token: string = authorization
      .replace("Bearer", "")
      ?.trim();

    const tokenData: TokenPayload = jwt
      .verify(token, "secret") as TokenPayload;

    request.userId = tokenData.id;

    return next();

  } catch {
    return response
      .sendStatus(401);
  }
}