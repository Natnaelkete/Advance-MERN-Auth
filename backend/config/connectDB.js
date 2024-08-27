import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected successfully ${connect.connection.host}`);
  } catch (err) {
    console.log(`Can't connect to DB ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
