import express, { urlencoded } from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import UserRoute from "./routes/userRoute.js";

const PORT = process.env.PORT || 8000;
await connectDB();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", UserRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
