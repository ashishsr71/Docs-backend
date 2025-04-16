import { Router } from "express";
import { auth } from "../middleware/auth-middleware.js";
import { createOrganization, getAllOrgUsers, getOrganization, joinOrganization, sendInvite } from "../controllers/organization.js";
import { getAllInvitaions,  } from "../controllers/userController.js";

export const orgRouter=Router();

orgRouter.post("/create-doc",auth,createOrganization);
orgRouter.get("/get-docs",auth,getOrganization);
orgRouter.post("/send-invite",auth,sendInvite);
orgRouter.get("/all-invites",auth,getAllInvitaions);
orgRouter.post("/join",auth,joinOrganization)
orgRouter.get("/getusers/:id",auth,getAllOrgUsers);