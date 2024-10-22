import Joi from 'joi';

export const passwordResetValidation = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordValidation = Joi.object({
  password: Joi.string().min(5).required(),
});
