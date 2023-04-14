import mongoose from "mongoose";
import {cartModel} from "./cart.model.js";

const registroCollection = 'Registro';

const registroSchema = mongoose.Schema({
    firstName:{
        type: String,
        require: true
    },
    lastName:{
        type: String,
        require: true
    },
    email:{
        type: String,
        unique: true,
        require: true
    },
    age: Number,
    password: {
        type: String,
        require: true
    }
})

registroSchema.pre('save', async function(next) {
    if (this.cart) {
      return next();
    }
    try {
      const cart = new cartModel({ user: this._id });
      await cart.save();
      this.cart = cart._id;
      next();
    } catch (error) {
      next(error);
    }
  });

const registroModel = mongoose.model(registroCollection, registroSchema)

export default registroModel