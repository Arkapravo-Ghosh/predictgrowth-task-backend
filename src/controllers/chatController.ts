import { Request, Response, NextFunction } from 'express';
import User from "../models/User";
import Chat from "../models/Chat";
import { chatWithAI } from "../utils/chatUtils";

export const sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { message } = req.body;
    const userinfo = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${req.headers.authorization?.split(" ")[1]}`,
      },
    });
    const userinfoData = await userinfo.json() as { email: string };
    const userEmail = userinfoData.email;
    if (!userEmail || !message) {
      res.status(400).json({ message: "Missing user or message" });
      return;
    };
    // Find or create user
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({ email: userEmail });
    };
    // Find or create chat history for user
    let chat = await Chat.findOne({ user: user._id });
    if (!chat) {
      chat = await Chat.create({ user: user._id, messages: [] });
    };
    // Add user message to chat history
    chat.messages.push({ role: "user", content: message, timestamp: new Date() });
    // Prepare messages for AI (last 10 for context)
    const aiMessages = chat.messages.slice(-10).map(m => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));
    // Get AI response
    const aiResponse = await chatWithAI(aiMessages);
    // Add AI response to chat history
    chat.messages.push({ role: "model", content: aiResponse, timestamp: new Date() });
    await chat.save();
    res.status(200).json({
      message: aiResponse,
      history: chat.messages,
    });
    return;
  } catch (error) {
    return next(error);
  }
};

export const getChats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userinfo = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${req.headers.authorization?.split(" ")[1]}`,
      },
    });
    const userinfoData = await userinfo.json() as { email: string };
    const userEmail = userinfoData.email;
    if (!userEmail) {
      res.status(400).json({ message: "Missing user" });
      return;
    }
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const chat = await Chat.findOne({ user: user._id });
    if (!chat) {
      res.status(200).json({ history: [] });
      return;
    }
    res.status(200).json({ history: chat.messages });
  } catch (error) {
    return next(error);
  }
};
