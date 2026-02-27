const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const db = require("./app/models/");
db.mongoose
.connect(db.url)
.then(() => {
    console.log("Database Connected");
})
.catch((err) => {
    console.error(`Unable to connect to MongoDB at ${db.url}:`, err);
    process.exit();
});

app.get("/", (_, res) => {
res.json({
    message: "Welcome to Smart Waste Management System (SWMS)",
});
});

require("./app/routes/user.routes")(app);
require("./app/routes/trashdata.Routes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});
