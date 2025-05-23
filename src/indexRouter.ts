import { Router } from "express";
import jwtCheck from "./middlewares/authJwt";

const router = Router();

import chatRouter from "./routes/chatRouter";
import userRouter from "./routes/userRouter";
import userDataMiddleware from "./middlewares/userMiddleware";

router.use("/chat", jwtCheck, userDataMiddleware, chatRouter);
router.use("/user", jwtCheck, userDataMiddleware, userRouter);

export default router;
