import mongoose from 'mongoose'
import IPost from '../types/Post.type'


const postSchema = new mongoose.Schema<IPost>({
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    image:{type:String,required:true},
    description:{type:String,required:true},
    country:{type:String,required:true},
    city:{type:String,required:true},
    status:{type:String,required:true}
},{timestamps:true})

const PostModel = mongoose.model('Post',postSchema)

export default PostModel