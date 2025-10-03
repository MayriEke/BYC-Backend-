const {Blog, validate} = require('../model/blog');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.post('/', [auth, admin], async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(404).json(error.details[0].message) 
    
    let blog = new Blog({
        title: req.body.title,
        content: req.body.content,
        blogImage: req.body.blogImage,
        blogProfileImage: req.body. blogProfileImage,
        profileName: req.body.profileName,
        ownerProfession: req.body.ownerProfession,
        category: req.body.ownerProfession,
        published: req.body.published,
    });

    blog = await blog.save()
    res.status(201).json({
        message: "Blog created Successfully",
        blog
    })
});


router.get('/published', async (req, res) => {
    try{
        const blog = await Blog.find({published: true})
    res.send(blog)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error: something went wrong" });
    console.log(err);

    }
});

router.patch("/:id/toggle", [auth, admin], async (req, res) => {
  try {
    
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send("Blog not found");

   
    blog.published = !blog.published;

    await blog.save();

    res.json({ message: `Blog ${blog.published ? "enabled" : "disabled"} successfully, blog `
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router