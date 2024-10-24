import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Failed to authenticate token" });
    }

    req.userId = decoded.id;
    next();
  });
};
