const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const port = 5000;

const mongoose = require("mongoose");

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

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data });
});

mongoose
  .connect(
    "mongodb+srv://jnoukpo:GhPVrlJCV1ZU8ton@cluster0.fszux.mongodb.net/takamanage?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
