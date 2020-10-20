const Post = require("../models/post");
const {validationResult } = require("express-validator");

const asyncHandler = require("../utils/asyncHandler")

// @desc   Get all posts
// @route  GET /api/vi/POSTS
// @access   public
exports.getPosts = asyncHandler(async (req, res, next) => {
    const posts = await Post.find().populate({path:"user", select:["username", "email"]});
    if (posts.length < 1) {
        res.status(200).json({
            status:"Fail",
            message:"There is no Posts at the moment"
        })
    }
    res.status(200).json({
        status: "Success",
        Count:posts.length,
        data:posts
    })
})

// @desc   CREATE NEW pOST
// @route  POST /api/vi/POST
// @access   private
exports.addPost = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    const { title, description}= req.body
    const post = await Post.create({
        title,
        description,
        user:req.user.id
    });
    res.status(201).json({
        status: "Seccuss",
        data:post
    })
})

// @desc   Get posts created by currently logged in UserT
// @route  Get /api/vi/post/me
// @access   private
exports.getmyPosts = asyncHandler(async (req, res, next) => {
    const myPosts = await Post.find({ user: req.user.id })
    if (myPosts.length<1) {
        res.status(404).json({
            status: "fail",
            message:"You have no created any post yet"
        })
    }
    res.status(200).json({
        status: "success",
        Count:myPosts.length,
        data:myPosts
    })
    
})