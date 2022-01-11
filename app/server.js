const express = require("express");
const cors = require("cors");
const db = require("./models");


const app = express();

db.mongoose
  .connect("mongodb://mongo:27017/login_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


var corsOptions = {
    origin: "http://localhost:8081",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

//parser requests of content-type
app.use(express.json());
app.use(express.urlencoded({entended: true}));

app.get("/", (req, res) => {
    res.json({message: "Welcome to my application!"});
});

//routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);


module.exports = app.listen("8080", () => {
    console.log("Server is running on port 8080");
});
