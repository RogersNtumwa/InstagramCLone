const express = require("express")
const router = express.Router();
const { check } = require("express-validator")

const {getPosts, addPost, getmyPosts }= require("../controllers/PostController")
const {protect} = require("../middleware/auth")

router.route("/")
    .get(getPosts)
    .post(protect, [
        check("title", "Title is required").not().isEmpty(),
        check("description", "Description is required").not().isEmpty(),
    ], addPost)

router.get("/me", protect, getmyPosts);

module.exports = router