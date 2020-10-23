const express = require("express");
const dotenv = require("dotenv");

// security packages
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit")
const hpp = require("hpp")
const cors = require("cors")

const dbcontext = require("./src/config/database")
const appError = require("./src/utils/appError");

const authRoute = require("./src/routes/auth");
const postRoute = require("./src/routes/post");
const app = express();


dotenv.config({ path: "./src/config/config.env" });
// Sanitize data
app.use(mongoSanitize())

// Set security haeders
app.use(helmet())

// Prevent xss attacks
app.use(xss())

// Rate liimit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 minutes
  max:100
  
})
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable cors
app.use(cors());


app.use(express.json())

dbcontext();

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/post", postRoute);

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