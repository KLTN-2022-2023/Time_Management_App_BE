require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

//Routes
const userRoutes = require("./routes/userRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");
const typeRoutes = require("./routes/typeRoutes.js");
const s3Routes = require("./routes/s3Routes.js");

//Database
mongoose.connect(mongoString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

//Connect
const app = express();

app.use(express.json());

// 👇️ configure CORS
app.use(cors());

//API
app.use("/User", userRoutes);
app.use("/Task", taskRoutes);
app.use("/Type", typeRoutes);
app.use("/S3", s3Routes);

app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
