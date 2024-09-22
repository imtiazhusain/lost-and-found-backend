import { ObjectId } from "mongoose";

interface IPost{
    author:ObjectId,
    image:string,
    status:string,
    description:string,
    city:string,
    country:string

}

export default IPost