import { Router } from "express";
const router = Router();
import { sendMessage } from "../controllers/chatbotController";
import authMiddleware from "../middleware/authMiddleware";

// Send message to chatbot (protected route)
router.post("/message", authMiddleware, sendMessage);

export default router;
