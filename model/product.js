const Joi = require('joi'); 
const mongoose = require('mongoose');
const { categorySchema } = require('./category')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500
    },
    productNumber: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    category: {
        type: categorySchema,
        required: true
    },
    rating: {
        type: String,
        default: 0
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 3,
        max: 1000
    }
})

const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        image: Joi.string().required(),
        price: Joi.string().required(),
        description: Joi.string().min(10).max(500).required(),
        productNumber: Joi.string().min(5).max(50).required(),
        categoryId: Joi.string().required(),
        rating: Joi.string(),
        numberInStock: Joi.number().min(10).max(1000).required(),
    }
    return Joi.validate(product, schema)
}


exports.Product = Product;
exports.validate = validateProduct;

