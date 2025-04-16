import { Router } from "express";
import { auth } from "../middleware/auth-middleware.js";
import { createDoc, getAllDocs, saveDoc } from "../controllers/controller.js";

export const router=Router();

router.post("/docs",auth,createDoc);
router.put("/doc/:id",auth,saveDoc);
router.get("/alldocs",auth,getAllDocs);