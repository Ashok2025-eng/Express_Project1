import jwt from "jsonwebtoken";

import mongoose from "mongoose";
import { Role } from "../types/enu.types";
import ENV_CONFIG from "../config/env.config";


interface IJwtPayload{
    _id:mongoose.Types.ObjectId;
    role:Role;
    email:string
}
//* Genrate jwt token   
export const generateJwtToken = (payload: IJwtPayload)=>{
try{
return jwt.sign(payload,ENV_CONFIG.JWT_SECRET,{
    expiresIn:ENV_CONFIG.JWT_EXPIRES_IN  as any,
})
}catch(error){
console.log(error)
throw error
}
}

//* Verify jwt token



export default generateJwtToken;