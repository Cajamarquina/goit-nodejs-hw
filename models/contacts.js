import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, handleUpdateReturnData } from "./hooks.js";

const nameRegexp = /^[a-zA-Zа-яА-Я]+([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*$/;
const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegexp = /^[\d ()-]+$/;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      match: nameRegexp,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      match: emailRegexp,
    },
    phone: {
      type: String,
      match: phoneRegexp,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", handleUpdateReturnData);
contactSchema.post("findOneAndUpdate", handleSaveError);

export const contactAddSchema = Joi.object({
  name: Joi.string().min(2).pattern(nameRegexp).required().messages({
    "any.required": "missing required name field",
    "string.pattern.base":
      "Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required email field",
    "string.pattern.base": "Invalid email address format",
  }),
  phone: Joi.string().min(7).pattern(phoneRegexp).required().messages({
    "any.required": "missing required phone field",
    "string.pattern.base": "Phone number must be digits and can contain spaces, dashes, parentheses",
  }),
  favorite: Joi.boolean(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(2).pattern(nameRegexp).messages({
    "string.pattern.base":
      "Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan",
  }),
  email: Joi.string().min(4).pattern(emailRegexp).messages({
    "string.pattern.base": "Invalid email address format",
  }),
  phone: Joi.string().min(7).pattern(phoneRegexp).messages({
    "string.pattern.base": "Phone number must be digits and can contain spaces, dashes, parentheses",
  }),
  favorite: Joi.boolean(),
});

export const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const Contact = model("contact", contactSchema);

export default Contact;
