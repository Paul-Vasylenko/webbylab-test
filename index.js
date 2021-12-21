const bodyParser = require("body-parser");
const express = require("express");
const initApi = require("./api/initApi");
const fileupload = require("express-fileupload");
require("dotenv").config();
const ErrorHandlingMiddleware = require("./middlewares/errorHandlingMiddleware");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json());
app.use(fileupload());
app.use("/api/v1", initApi());
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});
