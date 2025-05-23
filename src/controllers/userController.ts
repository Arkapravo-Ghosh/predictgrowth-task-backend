import { Request, Response, NextFunction } from "express";
import User from "../models/User";

// POST /onboarding
export const onboarding = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, company } = req.body;
    let { company_description } = req.body;
    if (company_description === undefined) company_description = null;
    // Update or create user with name, company, and description
    const user = await User.findOneAndUpdate(
      { email: req.user?.email },
      { $set: { name, company, company_description } },
      { new: true, upsert: true },
    );
    res.status(200).json({ message: "Onboarding complete", user });
    return;
  } catch (error) {
    return next(error);
  };
};

// GET /user
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findOne({ email: req.user?.email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    };
    res.status(200).json({ user });
    return;
  } catch (error) {
    return next(error);
  };
};

// POST /user
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, company, company_description } = req.body;
    if (!name && !company && !company_description) {
      res.status(400).json({ message: "No fields provided to update" });
      return;
    }
    const updateFields: Record<string, unknown> = {};
    if (name !== undefined) updateFields.name = name;
    if (company !== undefined) updateFields.company = company;
    if (company_description !== undefined) updateFields.company_description = company_description;
    const user = await User.findOneAndUpdate(
      { email: req.user?.email },
      { $set: updateFields },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "User updated", user });
  } catch (error) {
    return next(error);
  }
};
