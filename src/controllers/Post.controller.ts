import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import CustomErrorHandler from "../middlewares/errors/customErrorHandler";
import { createPostValidation, editPostValidation } from "../utils/joiValidation";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloundinary";
import HelperMethods from "../utils/helperMethods";
import PostModel from "../models/Post.model";
import { IAllPostQuery, IAuthRequest, IPostUpdateData, IQuery } from "../interfaces/interfaces";
import mongoose from "mongoose";
import extractPublicId from "../utils/extractPublicID";

const createPost =async(req:Request,res:Response,next:NextFunction)=>{
    try {
         req.body.image = req?.file?.filename;
        const {error} = createPostValidation(req.body)
         if (error) {
        console.log(error.message);
        return next(createHttpError(422,error.message));
      }
      const { description,city,country,status,image } = req.body;

       if(req?.file){
        let uploadResult:UploadApiResponse | undefined
        try {
             const filePath = req.file?.path;
    const fileFormat = req.file?.mimetype.split('/')[1]; // Get the format like 'png', 'jpeg' etc.
     uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: image,  
        folder: "user-posts",
        format: fileFormat, // Ensure this is just the extension (e.g., 'jpg', 'png')
    });


    
       HelperMethods.deleteFileIfExists(filePath);
        } catch (error) {
            console.log(error)
            return next(createHttpError(500,'Internal server Error'))
        }   
       

     const _req = req as IAuthRequest;
      const createdPost = new PostModel({
        author:_req._id,
        description,
        city,
        country,
        status,
       
        ...(uploadResult &&{
              image:uploadResult.secure_url 
        }),
      });

      



       await createdPost.save();

      return res.status(201).json({
        status: true,
        message: "Post created successfully",
        
      });
    }

    } catch (error) {
     console.log(error)
     return next(CustomErrorHandler.serverError())   
    }
}


const allPosts = async (req:Request,res:Response,next:NextFunction)=>{
  try {
    


        const { status, time = 'Latest', country, city } = req.query as {
      status?: string;
      time?: string;
      country?: string;
      city?: string;
    };

    

    // Constructing the query object
    const query: IAllPostQuery = {
      ...(status && { status }),
         ...(country && { country: { $regex: country, $options: 'i' } }), // Case-insensitive search
      ...(city && { city: { $regex: city, $options: 'i' } }), 
    };

    const sortOrder = time === 'Latest' ? -1 : 1;


     const posts = await PostModel.find(query)
      .populate({ path: 'author', select: 'name profilePic country city email phoneNo' })
      .select('-__v')
      .sort({ createdAt: sortOrder });
    return res.status(200).json({
      status:true,
      postsData:posts
    })
  } catch (error) {
    console.log(error)
    return next(CustomErrorHandler.serverError())
  }
}



const userPosts = async (req:Request,res:Response,next:NextFunction)=>{
  try {



 const { status, time = 'Latest', country, city } = req.query as {
      status?: string;
      time?: string;
      country?: string;
      city?: string;
    };

   

    const _req = req as IAuthRequest

    // Constructing the query object
    const query: IQuery = {
        author:_req._id ,
      ...(status && { status }),
         ...(country && { country: { $regex: country, $options: 'i' } }), // Case-insensitive search
      ...(city && { city: { $regex: city, $options: 'i' } }), 
    };

    const sortOrder = time === 'Latest' ? -1 : 1;

     const posts = await PostModel.find(query)
      .populate({ path: 'author', select: 'name profilePic country city email phoneNo' })
      .select('-__v')
      .sort({ createdAt: sortOrder });
    return res.status(200).json({
      status:true,
      postsData:posts
    })
  } catch (error) {
    console.log(error)
    return next(CustomErrorHandler.serverError())
  }
}


const getPost=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    
    const params = req.params

    const isValidId = mongoose.Types.ObjectId.isValid(params._id)
    if(!isValidId){
      return next(createHttpError(403,"Invalid post ID"))
    }

    const post = await PostModel.findById(params._id).select('status description city country image')
    if(!post) return next(CustomErrorHandler.notFound('Post not found'))

      return res.status(200).json({
        status:true,
        postData:post
      })
  } catch (error) {
    console.log(error)
    return next(CustomErrorHandler.serverError())
  }
}


const editPost =async(req:Request,res:Response,next:NextFunction)=>{
    try {

        const params = req.params
        if (!params._id) {
        return next(createHttpError(403,"Post ID is missing"));
      }
        const image = req?.file?.filename;

      const { description,status,country,city } = req.body;

      if (req?.body?.image) {
        delete req.body.image;
      }

      // validation
      const isValidID = mongoose.Types.ObjectId.isValid(params._id);

      if (!isValidID) {
        return next(CustomErrorHandler.invalidId("Invalid Post ID"));
      }
      const { error } = editPostValidation(req.body);

      if (error) {
        console.log(error.message);
        return next(createHttpError(422,error.message));
      }





      

      let uploadResult:UploadApiResponse | undefined
       if(req?.file){
        try {
             const filePath = req.file?.path;
                const fileFormat = req.file?.mimetype.split('/')[1]; // Get the format like 'png', 'jpeg' etc.
            uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: image,  
        folder: "user-posts",
        format: fileFormat, // Ensure this is just the extension (e.g., 'jpg', 'png')
    });


    
       HelperMethods.deleteFileIfExists(filePath);
        } catch (error) {
            console.log(error)
            return next(createHttpError(500,'Internal server Error'))
        }   


        // deleting existing file from cloundinary
        const postPreviousData = await PostModel.findById(params._id);

      if (postPreviousData?.image) {
        try {
          
    const result = await cloudinary.uploader.destroy(extractPublicId(postPreviousData.image));
    if (result.result === 'ok') {
      console.log('File deleted successfully from cloundinary');
    } else {
      console.log('File could not be deleted from cloundinary');
    }
  } catch (error) {
    console.error('Error deleting file: from cloundinary', error);
  }
      }
       
        }



         const postUpdatedData:IPostUpdateData = {
        description,
        status,
        ...(uploadResult &&{
              image:uploadResult.secure_url 
        }),
        city,
        country
      };

      if (!postUpdatedData?.image) {
        delete postUpdatedData.image;
      }

      

       await PostModel.findByIdAndUpdate(
        params._id,
        postUpdatedData,
        { new: true } // Return the updated document
      );

      

      



      

      return res.status(201).json({
        status: true,
        message: "Post updated successfully",
        
      });
    

    } catch (error) {
     console.log(error)
     return next(CustomErrorHandler.serverError())   
    }
}



const deletePost=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    
    const params = req.params

    const isValidId = mongoose.Types.ObjectId.isValid(params._id)
    if(!isValidId){
      return next(createHttpError(403,"Invalid post ID"))
    }

    const post = await PostModel.findByIdAndDelete(params._id)
    if(!post) return next(CustomErrorHandler.notFound('Post not found'))

      return res.status(200).json({
        status:true,
        postData:post
      })
  } catch (error) {
    console.log(error)
    return next(CustomErrorHandler.serverError())
  }
}




export {createPost,allPosts,userPosts,getPost,editPost,deletePost}