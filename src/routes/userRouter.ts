import { Router } from "express";
import { onboarding, getUser, updateUser } from "../controllers/userController";

const router = Router();

router.post("/onboarding", onboarding);
router.get("/", getUser);
router.post("/", updateUser);

export default router;
