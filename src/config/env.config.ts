import "dotenv/config";

const ENV_CONFIG = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ?? 8000,
  DB_URI: process.env.DB_URI!!,

  //!JWT
  JWT_SECRET: process.env.JWT_SECRET!!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",

  //!COOKIE
  COOKIE_EXPIRES_IN: Number(process.env.COOKIE_EXPIRES_IN) ?? 7,

  //! node mailer
  SMTP_HOST: process.env.SMTP_HOST!!,
  SMTP_PORT: Number(process.env.SMTP_PORT ?? "465"),
  SMTP_SERVICE: process.env.SMTP_SERVICE!!,
  SMTP_USER: process.env.SMTP_USER!!,
  SMTP_PASS: process.env.SMTP_PASS!!,
  SMTP_MAIL_FROM: process.env.SMTP_MAIL_FROM!!,

  //!CLOUDINARY
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!!,
};

export default ENV_CONFIG;
