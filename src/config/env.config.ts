import "dotenv/config";

const ENV_CONFIG ={
    NODE_ENV :process.env.NODE_ENV ??  "development",
    PORT:process.env.PORT ?? 8000,
    DB_URI: process.env.DB_URI!!,


//!JWT
JWT_SECRET:process.env.JWT_SECRET!!,
JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN ?? "7d",


//!COOKIE
COOKIE_EXPIRES_IN: Number(process.env.COOKIE_EXPIRES_IN)?? 7,


//!CLOUDINARY
CLOUDINARY_CLOUD_NAME:  process.env.CLOUDINARY_CLOUD_NAME!!,
CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY!!,
CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET!!,



}

export default ENV_CONFIG;