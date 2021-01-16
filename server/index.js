const express    = require("express");
const bodyParser = require("body-parser");
const mongoose   = require("mongoose");
const dotenv     = require("dotenv");

const startDBConnection = require("./config/db");

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

const userRoutes  = require("./routes/user")
const photoRoutes = require("./routes/photo")

app.use(express.json());

// init routes
app.use("/api/user", userRoutes);
app.use("/api/photo", photoRoutes);

startDBConnection();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to shopstagram friend!" });
});

app.listen(PORT, (req, res) => {
  console.log(`Server's up on port ${PORT}`);
});
