import * as Joi from 'joi';

export const EnvSchema = Joi.object({
  // Server
  SERVICE_NAME: Joi.string().default('App'),
  PORT: Joi.number().integer(),
  //NODE_ENV: Joi.string().valid('dev', 'stag', 'prod').default('dev'),
  NODE_ENV: Joi.string().default('dev'),
  // Logging
  MAX_LOG_FILES: Joi.string(),

  // Swagger
  DOC_USER: Joi.string(),
  DOC_PASS: Joi.string(),

  // Init system user
  SYSTEM_EMAIL: Joi.string(),
  SYSTEM_PASSWORD: Joi.string(),

  // Auth
  JWT_SECRET_KEY: Joi.string(),
  JWT_EXPIRES_IN: Joi.string(),

  // Database
  DB_LOG: Joi.boolean().default(true),
  DB_SYNC: Joi.boolean().default(true),
  DB_HOST: Joi.string(),
  DB_PORT: Joi.number().integer(),
  DB_NAME: Joi.string(),
  DB_USER: Joi.string(),
  DB_PASSWORD: Joi.string(),

  // Database [Test]
  TEST_DB_LOG: Joi.boolean().default(true),
  TEST_DB_SYNC: Joi.boolean().default(true),
  TEST_DB_HOST: Joi.string(),
  TEST_DB_PORT: Joi.number().integer(),
  TEST_DB_NAME: Joi.string(),
  TEST_DB_USER: Joi.string(),
  TEST_DB_PASSWORD: Joi.string(),
});
