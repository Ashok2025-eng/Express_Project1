import mongoose from "mongoose";

const connectDataBase = (DB_URI: string) => {
  mongoose
    .connect(DB_URI)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log("------Database connection error-----");
    });
};

export default connectDataBase;
