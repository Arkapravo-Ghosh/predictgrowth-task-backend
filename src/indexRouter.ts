import { Router } from "express";
import jwtCheck from "./middlewares/authJwt";

const router = Router();

import chatRouter from "./routes/chatRouter";

router.use("/chat", jwtCheck, chatRouter);

export default router;
