"use strict";
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const folderRouter = require("./folder-router");
const noteRouter = require("./note-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

const whitelist = ["http://localhost:3000", "http://my-project.com"];
const options = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use("/api/notes", noteRouter);
app.use("/api/folders", folderRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
