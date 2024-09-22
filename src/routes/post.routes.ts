import express from 'express'
import { allPosts, createPost, deletePost, editPost, getPost, userPosts } from '../controllers/Post.controller'
import auth from '../middlewares/auth'
import upload from '../middlewares/multer'
const router = express.Router()


router.post('/create',auth,upload.single('image'),createPost)
router.get('/all',allPosts)
router.get('/user-posts',auth,userPosts)
router.get('/get-post/:_id',auth,getPost)
router.patch('/update-post/:_id',auth,upload.single('image'),editPost)
router.delete('/delete-post/:_id',auth,deletePost)

export default router