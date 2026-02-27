import "dotenv/config";
import express from "express";
import cors from "cors";
import { recipesRouter } from "./routes/recipes.js";
import { chatRouter } from "./routes/chat.js";
import { healthRouter } from "./routes/health.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/recipes", recipesRouter);
app.use("/chat", chatRouter);
app.use(healthRouter);

app.listen(3001, () => console.log("API running on :3001"));
