export {};
const express = require("express");
const mainRouter = require("./routes/mainRouter");

const PORT: number = 3001;

const app = express();

app.use("/api/v1", mainRouter);

app.listen(PORT, (err: String) => {
  if (err) {
    console.log(err);
  }
  console.log("Server is listening on PORT:", PORT);
});
