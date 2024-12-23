import express from "express";
import { createUser } from "../controllers/clerkWebhookController";
import bodyParser from "body-parser";

const webhookRouter = express.Router();

// userRouter.route("/signup").post(signup);
webhookRouter.post(
  "/webhooks",
  bodyParser.raw({ type: "application/json" }),
  createUser
);

export default webhookRouter;
