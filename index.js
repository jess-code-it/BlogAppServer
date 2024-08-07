const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");


const app = express();
const port = process.env.PORT || 4000;
const mongodb_string = process.env.MONGODB_STRING || "mongodb+srv://gomezjeswel:4yqpgx7pWorIEMVD@cluster0.4a574gv.mongodb.net/fitness-tracker?retryWrites=true&w=majority&appName=Cluster0";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["http://localhost:4000"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));


mongoose.connect(mongodb_string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB:", error));

app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API is now online on port ${port}`);
  });
}

module.exports = { app, mongoose };
