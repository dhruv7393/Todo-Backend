import express from 'express';
const app: express.Application = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;
const connectDB = require("./config/db");
let cors = require("cors");

connectDB();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello Shleeji");
});

app.use("/api/headers", require("./routes/todoHeadersRoute"));
app.use("/api/todos", require("./routes/todoRoute"));
app.use("/api/dailytask", require("./routes/dailyTaskRoute"));
app.use("/api/call", require("./routes/callRoute"));

app.listen(port, () => console.log("Server has been initaited"));