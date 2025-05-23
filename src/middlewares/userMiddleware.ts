import { NextFunction, Request, Response } from "express";
import axios from "axios";

const userDataMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const response = await axios.get(`${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    req.user = response.data;
    next();
  } catch (error) {
    next(error);
  };
};

export default userDataMiddleware;
