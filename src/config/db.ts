import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/split-easy');
    console.log("Database connection established on port - 27017");
  } catch (e) {
    console.log("Error connecting to mongodb", e);
    process.exit(1);
  }
}

export default connectDB;