import Joi from 'joi'
import IPost from '../types/Post.type'
import { IUserRegistrationBody } from '../interfaces/interfaces'

const loginValidation=(body:{email:string,password:string})=>{
    const schema =  Joi.object({
        email:Joi.string().required().label("Email"),
        password:Joi.string().required().label("Password")
    })
    return schema.validate(body)
}


const signupValidation =(body:IUserRegistrationBody)=>{
     const schema = Joi.object({
      name: Joi.string().min(2).max(30).required().label("Name"),
      email: Joi.string().email().required().label("Email"),
      profilePic: Joi.string().required().label("Profile Picture"),
      phoneNo: Joi.string().required().label("Phone No"),
      country: Joi.string().required().label("Country"),
      city: Joi.string().required().label("City"),
      password: Joi.string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"
          )
        )
        .required()
        .messages({
          "string.pattern.base":
            "Password must have  7+ chars, 1 uppercase, 1 lowercase, 1 special char",
          "string.empty": "Please provide password",
          "string.length":
            "Password must have  7+ chars, 1 uppercase, 1 lowercase, 1 special char",
          "any.required":
            "Password must have  7+ chars, 1 uppercase, 1 lowercase, 1 special char",
        }),
    });

    return schema.validate(body)
}


 const editUserValidation = (body:{email:string,password:string,name:string,_id:string}) =>{
    const schema = Joi.object({
      name: Joi.string().min(2).max(30).required().label("Name"),
      email: Joi.string().email().required().label("Email"),
      _id: Joi.string().required().label("User ID"),
      password: Joi.string()
        .optional() // Makes the field optional
        .allow("") // Explicitly allow an empty string
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()_+\\-=\\[\\]{};:'\"\\\\|,.<>\\/?]).{8,30}$"
          )
        )
        .messages({
          "string.pattern.base":
            "Password must have 8-30 chars, 1 uppercase, 1 lowercase, and 1 special character",
          "string.empty": "Please provide password",
          "string.length": "Password must be between 8 and 30 characters long",
          "any.required": "Password field is required",
        })
        .label("Password"),
    });

    return schema.validate(body);
  }

const verifyEmailValidation = (body:{userId:string,OTP:string})=>{
  const schema = Joi.object({
      userId: Joi.string().required(),
      OTP: Joi.string()
        .length(4)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
          "string.pattern.base": "Invalid OTP",
          "string.empty": "OTP field cannot be empty. Please provide OTP.",
          "string.length": "Invalid OTP.",
          "any.required": "Please provide the OTP to proceed",
        }),
  })

  return schema.validate(body)
}

const sendOTPValidation = (body:{userEmail:string,userId:string})=>{
  const schema =Joi.object({
 userEmail: Joi.string().email().required(),
      userId: Joi.string().required(),
  })
  return schema.validate(body)
}

const createPostValidation= (body:IPost)=>{
const schema = Joi.object({

    image:Joi.string().required().label("Post Image"),
    status:Joi.string().required().label("Status"),
    description:Joi.string().required().label("Description"),
    city:Joi.string().required().label("city"),
    country:Joi.string().required().label("country")
})
return schema.validate(body)
}


const editPostValidation= (body:IPost)=>{
const schema = Joi.object({
  
    status:Joi.string().required().label("Status"),
    description:Joi.string().required().label("Description"),
    city:Joi.string().required().label("city"),
    country:Joi.string().required().label("country")
})
return schema.validate(body)
}




export {loginValidation,signupValidation,verifyEmailValidation,sendOTPValidation,createPostValidation,editPostValidation,editUserValidation}