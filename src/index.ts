// src/index.ts
import express from "express";
import cors from "cors";
import process from "process";
import dotenv from "dotenv";
dotenv.config();

const app: express.Application = express();
const port = 3000;
const mongourl: string = process.env.MONGO_URI as string;

const connectDB = require("./config/db.js");
connectDB(mongourl);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: express.Request, res: express.Response) => {
  res.send(`Hello Shleeji`);
});

app.use("/api/streakcount", require("./routes/streakCountRoute.js"));
app.use("/api/tasks", require("./routes/taskRoute.js"));
app.use("/api/chron", require("./routes/chron.js"));

app.listen(port, () => {
  console.log("Server has been initaited at:", port);
});
