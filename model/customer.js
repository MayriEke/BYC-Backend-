const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    Minlenght: 5,
    Maxlenght: 50,
  },

  isGold: {
    type: Boolean,
    default: false,
  },

  company: {
    type: String,
  },

  country: {
    type: String,
    required: true,
  },

  cityTown: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = {
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
        company: Joi.string(),
        country: Joi.string().required(),
        cityTown: Joi.string().required(),
        state: Joi.string().required(),
        phone: Joi.string().min(5).max(50).required(),
        email: Joi.string().required(),
  };
  return Joi.validate(customer, schema);
};

exports.Customer = Customer;
exports.validate = validateCustomer;
