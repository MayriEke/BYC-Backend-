const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');



// const {genreSchema} = require('./genre')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLenght: 5,
        maxLenght: 225
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLenght: 5,
        maxLenght: 225
    },
    password: {
        type: String,
        required: true,
        minLenght: 5,
        maxLenght:  1024
    },
    
})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { _id: this._id, name: this.name, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"));
    return token;
}




const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
    confirmPassword: Joi.any().valid(Joi.ref("password")).required()
  .error(new Error("Passwords do not match"))
  });

  return Joi.validate(user, schema);
}


exports.User = User;
exports.validate = validateUser;
