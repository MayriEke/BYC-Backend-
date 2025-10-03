const mongoose = require('mongoose')
const Joi  = require('joi')

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: 5,
            maxLenght: 1000,
        },
        content: {
            type: String,
            required: true,
            minLength: 20,
            maxLenght: 1000,
        },
        blogImage: [String],
        blogProfileImage: {
            type: String,
            required: true
        },
        profileName: {
            type: String,
            required: true
        },
        ownerProfession: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: ["Tech", "Business", "Lifestyle", "Education", "Others"],
            default: "other"
        },
        published: {
            type: Boolean,
            default: true
        },
        createdAt:{
            type:Date,
            default: Date.now
        },
    }
);

const Blog = mongoose.model('Blog', blogSchema)

function validateBlog(blog) {
      const schema = Joi.object({
        title: Joi.string().min(5).max(1000).required(),
        content: Joi.string().min(20).max(1000).required(),
        blogImage: Joi.array().items(Joi.string()),
        blogProfileImage: Joi.string().required(),
        profileName: Joi.string().required(),
        ownerProfession: Joi.string().required(),
        category: Joi.string().valid("Tech", "Business", "Lifestyle", "Education", "Others"),
        published: Joi.boolean(),
        createdAt: Joi.date()
    })
    return schema.validate(blog)
}

exports.validate = validateBlog;
exports.Blog = Blog;

