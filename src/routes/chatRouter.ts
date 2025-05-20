import { Router } from "express";
import { sendMessage, getChats } from "../controllers/chatController";

const router = Router();

router.post("/", sendMessage);
router.get("/", getChats);

export default router;
