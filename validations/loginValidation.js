import Joi from 'joi';

export const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(5).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 5 characters long',
      'any.required': 'Password is required'
    }),
  });

  return schema.validate(data);
};
