import * as Joi from 'joi';

export const configurationValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().required(),

  SUPERADMIN_EMAIL: Joi.string().required(),
  SUPERADMIN_FIRSTNAME: Joi.string().required(),
  SUPERADMIN_PASSWORD: Joi.string().required(),

  JWT_TOKEN_EXPIRES: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),

  POSTGRES_DB_HOST: Joi.string().required(),
  POSTGRES_DB_PORT: Joi.number().default(5432).required(),
  POSTGRES_DB_NAME: Joi.string().required(),
  POSTGRES_DB_USERNAME: Joi.string().required(),
  POSTGRES_DB_PASSWORD: Joi.string().required(),
});
