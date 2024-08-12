import mongoose from "mongoose";

const PROD_MONGO_URL="mongodb+srv://aakashsrivastava:Aakash2022@cluster0.rmts6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/split-easy');
    console.log("Mongo Atlast Connected");
  } catch (e) {
    console.log("Error connecting to mongodb", e);
    process.exit(1);
  }
}

export default connectDB;
