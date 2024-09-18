const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");

const port = 5000;

const mongoose = require("mongoose");

const usersRoutes = require("./routes/auth");
const projectsRoutes = require("./routes/project");
const tasksRoutes = require("./routes/task");


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", usersRoutes);
app.use("/projects", projectsRoutes);
app.use("/tasks", tasksRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
