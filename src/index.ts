// src/index.ts
import express from 'express';
import cors from "cors";

const app: express.Application = express();
const port = 3000;

const connectDB = require("./config/db");
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello Shleeji");
});

app.listen(port, () => console.log("Server has been initaited"));


app.use("/api/headers", require("./routes/todoHeadersRoute"));
app.use("/api/todos", require("./routes/todoRoute"));
app.use("/api/dailytask", require("./routes/dailyTaskRoute"));
app.use("/api/call", require("./routes/callRoute"));

/*

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});

// Homepage
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send("Hello World!");
});

// GET
app.get('/get', (req: express.Request, res: express.Response) => {
  res.status(200).header("x-get-header", "get-header-value").send("get-response-from-compute");
});

//POST
app.post('/post', (req: express.Request, res: express.Response) => {
  res.status(200).header("x-post-header", "post-header-value").send(req.body.toString());
});

//PUT
app.put('/put', (req: express.Request, res: express.Response) => {
  res.status(200).header("x-put-header", "put-header-value").send(req.body.toString());
});

//PATCH
app.patch('/patch', (req: express.Request, res: express.Response) => {
  res.status(200).header("x-patch-header", "patch-header-value").send(req.body.toString());
});

// Delete
app.delete('/delete', (req: express.Request, res: express.Response) => {
  res.status(200).header("x-delete-header", "delete-header-value").send();
});

*/