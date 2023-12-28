import * as Joi from 'joi';

export const configurationValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.string().required(),

  POSTGRES_DB_HOST: Joi.string().required(),
  POSTGRES_DB_PORT: Joi.number().default(5432).required(),
  POSTGRES_DB_NAME: Joi.string().required(),
  POSTGRES_DB_USERNAME: Joi.string().required(),
  POSTGRES_DB_PASSWORD: Joi.string().required(),
});
