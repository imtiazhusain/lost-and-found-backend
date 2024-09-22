import CustomErrorHandler from "./errors/customErrorHandler";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/envConfig";
import { Request,Response,NextFunction } from "express";
import createHttpError from "http-errors";
import { IAuthRequest, ITokenPayload } from "../interfaces/interfaces";


const auth = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!(authHeader && authHeader.startsWith("Bearer"))) {
      return next(CustomErrorHandler.unAuthorized());
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(CustomErrorHandler.unAuthorized());
    }

    try {
      const tokenPayload = jwt.verify(token, ACCESS_TOKEN_SECRET as string) as ITokenPayload;
    
    const _req = req as IAuthRequest;
    _req._id = tokenPayload._id;
  
    next();
    } catch (error) {
      console.log(error)
      return next(createHttpError(401,"Token Expired"))
    }
    
  } catch (error) {
    console.log(error);
    return next(createHttpError(500,"Internal Server Error"));
    
  }
};



export default auth;
