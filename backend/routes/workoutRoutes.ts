import express from "express";
import {
  deleteWorkout,
  getWorkouts,
  postWorkout,
  updateWorkout,
} from "../controllers/workoutController";

const workoutRouter = express.Router();

workoutRouter.route("/").post(postWorkout);
workoutRouter.route("/:userId/:type").get(getWorkouts);
workoutRouter.route("/:workoutId").patch(updateWorkout).delete(deleteWorkout);

export default workoutRouter;
