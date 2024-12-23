import express from "express";
import {
  deleteWeight,
  getWeights,
  postWeight,
  updateWeight,
} from "../controllers/weightController";

const weightRouter = express.Router();

weightRouter.route("/:userId").get(getWeights);
weightRouter.route("/").post(postWeight);
weightRouter.route("/:weightId").patch(updateWeight).delete(deleteWeight);

export default weightRouter;
