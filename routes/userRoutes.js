import { Router } from "express";
import { login, logout, signup } from "../controllers/userController.js";

export const userRouter=Router();


userRouter.post('/login',login);
userRouter.post('/signup',signup);
userRouter.post('/logout',logout);