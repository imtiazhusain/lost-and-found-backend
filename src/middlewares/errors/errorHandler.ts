import { DEBUG_MODE } from "../../config/envConfig";
import joi from "joi";

import CustomErrorHandler from "./customErrorHandler";
import {  NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

// advanced error handler middleware
// const errorHandler = (error: HttpError, req:Request, res:Response,next:NextFunction) => {
//   let statusCode:number = 500;
//   let data = {
//     status: "error",
//     message: "Internal server error",

//     ...(DEBUG_MODE == "true" && { originalError: error.message }),
//   };

//   if (error instanceof joi.ValidationError) {
//     console.log("console validation error here");
//     statusCode = error?.statusCode || 422;
//     data = {
//       status: "error",
//       message: error.message,
//     };
//   }
//   console.log('error is instace of ' )
//   console.log(error instanceof HttpError)
//   console.log(error.stack)

//   if (error instanceof HttpError) {
//     statusCode = error.statusCode || 400;
//     data = {
//       status: "error",
//       message: error.message,
//     };
//   }

//   return res.status(statusCode).json(data);
// };


const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    
      status:false,
      message: err.message,
      ...(DEBUG_MODE &&{
          errorStack:  err.stack,
      })
    
    
  });
};

export default globalErrorHandler;
