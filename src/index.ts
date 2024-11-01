// src/index.ts
import express from 'express';
import cors from "cors";
import process from "process"
import dotenv from 'dotenv';
import { CronJob } from 'cron';
dotenv.config();

const job = new CronJob(
	'0 * * * * *', // cronTime
	function () {
		console.log('You will see this message every second');
	}, // onTick
	null, // onComplete
	true, // start
	'America/New_York' // timeZone
);

const app: express.Application = express();
const port = 3000;
const mongourl: string = (process.env.MONGO_URI as string);

const connectDB = require("./config/db.js");
connectDB(mongourl);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: express.Request, res: express.Response) => {
  res.send(`Hello Shleeji`);
});

app.use("/api/tests", require("./routes/testRoute.js"));
app.use("/api/headers", require("./routes/todoHeadersRoute.js"));
app.use("/api/todos", require("./routes/todoRoute"));
app.use("/api/dailytask", require("./routes/dailyTaskRoute"));
app.use("/api/call", require("./routes/callRoute"));
app.use("/api/tasks", require("./routes/taskRoute"));

app.listen(port, () => {
  console.log("Server has been initaited")
  job.start()
});
