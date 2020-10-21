const Post = require("../models/post");
const {validationResult } = require("express-validator");

const asyncHandler = require("../utils/asyncHandler")
const appError = require("../utils/appError")

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

// @desc   Get a post
// @route  GET /api/vi/POSTS/id
// @access   public

exports.getPost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id });
    if (!post) {
        return next(new appError(`There is no such post with id ${id} on the server`, 404));
    }
    res.status(200).json({
        status: "Success",
        data: post
    });
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


// @desc   update Post
// @route  patch /api/vi/bugs/:post_id
// @access   private to only post owner
exports.updatePost = asyncHandler( async (req, res, next) => {

    let post = await Post.findById(req.params.id);
    if (!post) {
        return next(new appError(`There is no such post with id ${req.params.id} on the server`, 404));
    }
    else if (post.user.toString() !== req.user.id) {
        return next(new appError("Only the post owner can update this post", 401))
    }
    post=await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.send({
      status: "Success",
      data: post,
    });

});

// @desc   update Post
// @route  patch /api/vi/bugs/:post_id
// @access   private to only post owner
exports.deletePost = asyncHandler(async (req, res, next) => {
    let post = await Post.findById(req.params.id);
    if (!post) {
        return next(new appError(`There is no such post with id ${req.params.id} on the server`, 404));
    }
    else if (post.user.toString() !== req.user.id) {
        return next(new appError("Only the post owner can delete this post", 401))
    }
    post = await Post.findByIdAndRemove(req.params.id);
    res.status(204).json({
        status: "Success",
        message:"Post deleted successfully"
    })
})

// @desc like apost
// route patch /api/v1/post/id
// acess private
