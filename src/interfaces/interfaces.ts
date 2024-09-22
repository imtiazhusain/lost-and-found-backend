import { Request } from "express";
import { ObjectId } from "mongoose";

// access token payload interface
export interface ITokenPayload {
    _id: ObjectId;
}

// interface to store user id in auth middleware
export interface IAuthRequest extends Request {
  _id: ObjectId;
}


export interface IUserRegistrationBody {
 name:string,
    email:string,
    password:string,
    profilePic:string,
    phoneNo:string,
    country:string,
    city:string,
}


export interface IQuery{
  author:ObjectId,
  status?:string,
  country?: string | { $regex: string; $options: string };
  city?: string | { $regex: string; $options: string }; 
}


export interface IPostUpdateData {
  description: string;
  status: string;
  image?: string | null; // Optional property
  city: string;
  country: string;
}



export interface IEditUser {
    name:string,
    email:string,
    profilePic?:string |null,
    password?:string
}




export interface IAllPostQuery {
  status?: string;
  country?: string | { $regex: string; $options: string };
  city?: string | { $regex: string; $options: string };
}