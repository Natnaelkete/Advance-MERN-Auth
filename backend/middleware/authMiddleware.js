import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
    try {
      const decoded = jwt.verify(process.env.JWT_SECRET, req.cookies.jwt);
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized");
    console.log("Not Authorized");
  }
});

export default protect;
