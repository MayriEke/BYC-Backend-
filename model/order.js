const Joi = require("joi");
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: String,
    image: String,
    price: Number,
    priceNumber: String,
    size: {
        type: [String],
        default: []
    },
    color: {
        type: [String],
        default: []
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    subtotal: Number
});

const orderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
        required: true
    },
    customerSnapshot:{
        name: String,
        email: String,
        phone: String,
        country: String,
        state: String,
        address: String,
        city: String,
        company: String
    },
    items: [
        orderItemSchema
    ],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: "pending"
    },
    deliveryStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentReference: {
        type: String,
        required: false
    },
    paymentGateway: {
        type: String,
        default: 'paystack'
    },
    transactionId: {
        type: String
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    updatedAt:{
        type:Date,
        default: Date.now
    }
});

orderSchema.pre('save', function(next){
    this.totalAmount = this.items.reduce((acc,item) => acc + (item.price * item.quantity),  0);
    this.updatedAt = new Date()
    next();
});

const Order = mongoose.model("order", orderSchema)

function validateOrder(order) {
    const schema = Joi.object({
        customerId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        customerSnapshot: Joi.object().keys({
            name:Joi.string().min(5).max(50).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required(),
            country: Joi.string().required(),
            state: Joi.string().required(),
            address: Joi.string().required(),
            city: Joi.string().required(),
            company: Joi.string().allow(""),
        }),
        items: Joi.array().items(
            Joi.object().keys({
            productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            name: Joi.string().required(),
            image: Joi.string().required(),
            price: Joi.number().required(),
            size: Joi.array().item(Joi.string()),
            color: Joi.array().item(Joi.string()),
            quantity: Joi.number().min(1).required(),
            subTotal: Joi.number().required()
            })

        ).min(1).required(),
        totalAmount: Joi.number(),
        paymentStatus: Joi.string().valid('pending', 'paid', 'failed', 'refunded'),
        deliveryStatus: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        paymentReference: Joi.string().optional(),
        paymentGateway: Joi.string().optional(),
        transactionId: Joi.string().optional(),
        createdAt: Joi.date(),
        updatedAt: Joi.date()
    })
    return schema.validate(order);
}

module.exports = {
    Order,
    validate: validateOrder,
    orderSchema
};