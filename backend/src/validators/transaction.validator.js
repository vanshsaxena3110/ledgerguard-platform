import Joi from "joi";

export const transactionSchema = Joi.object({
  type: Joi.string()
    .valid("credit", "debit")
    .required(),

  amount: Joi.number()
    .positive()
    .required(),

  description: Joi.string()
    .trim()
    .max(200)
    .allow(""),

  status: Joi.string().valid("pending", "completed", "failed"),
});

export const updateTransactionSchema = Joi.object({
  type: Joi.string().valid("credit", "debit"),
  amount: Joi.number().positive(),
  description: Joi.string().trim().max(200).allow(""),
  status: Joi.string().valid("pending", "completed", "failed"),
}).min(1);
