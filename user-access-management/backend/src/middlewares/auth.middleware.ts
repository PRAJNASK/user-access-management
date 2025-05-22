import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded as { id: number; role: string };
      next();  // just call next(), do NOT return
      return;  // return void explicitly
    } catch (err) {
      res.status(401).json({ message: "Invalid token" }); // do not return this
      return;
    }
  } else {
    res.status(401).json({ message: "Token missing" }); // do not return this
    return;
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden: Access denied" }); // do not return
      return;
    }
    next(); // call next(), do not return
    return;
  };
};
