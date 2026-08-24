import mongoose from "mongoose";
import { minLength } from "zod";



//* interface

interface ICategoryDocument extends Document{
    name:string;
    description:string;
    image:string;
}
//* Schema

const categorySchema = new mongoose.Schema({
name:{
    type:String,
    required:[true, "name is required"],
    unique:true,
    minLength:3,

},
description:{
    type:String,
required:[true, "Description is required"],
minLength:[10,"description at least 10 character"]


},

image:{
    type:String,
    required:[true,"image is required"]
}

},{timestamps:true})


const Category  =mongoose.model<ICategoryDocument>("Category",categorySchema)
export default Category;