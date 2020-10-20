const express = require("express");
const dotenv = require("dotenv");
const dbcontext = require("./src/config/database")
const appError = require("./src/utils/appError");

const authRoute = require("./src/routes/auth")
const app = express();

dotenv.config({ path: "./src/config/config.env" });
app.use(express.json())

dbcontext();

app.use("/api/v1/auth", authRoute);

// Error handling
app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res
    .status(err.statusCode)
    .json(
      { status: err.status, message: err.message } || "Unknown error occured"
    );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port  ${PORT} `)
})