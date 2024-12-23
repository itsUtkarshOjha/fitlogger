import "dotenv/config";
import express from "express";
import weightRouter from "./routes/weightRoutes";
import userRouter from "./routes/userRoutes";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import webhookRouter from "./routes/clerkWebhookRoutes";
import workoutRouter from "./routes/workoutRoutes";

const app = express();
app.use(clerkMiddleware());
app.use(cors());

app.use(express.json());

app.use("/api/v1/weight", weightRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/workout", workoutRouter);
app.use("/api", webhookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
