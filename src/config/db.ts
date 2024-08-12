import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://aakashsrivastava008:Aakash2022@cluster0.rmts6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log("MongoDB Atlast Cluster 0 Connected");
  } catch (e) {
    console.log("Error connecting to mongodb", e);
    process.exit(1);
  }
}

export default connectDB;