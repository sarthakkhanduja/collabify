"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mainRouter = require("./routes/mainRouter");
const PORT = 3001;
const app = express();
app.use("/api/v1", mainRouter);
app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server is listening on PORT:", PORT);
});
