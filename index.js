const express = require('express');
const URL=require("./models/url.js")
const path=require("path");
const cookieParser=require("cookie-parser")
const urlRoute = require("./routes/url");
const staticRoute=require("./routes/staticRouter");
const userRoute = require("./routes/user");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const { connectToMongoDB } = require("./connect.js");

const app = express(); // Call express() to initialize the app
const PORT = 8001;
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(express.json()); // Middleware to parse JSON
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use("/url",restrictToLoggedinUserOnly, urlRoute);
app.use("/",staticRoute);
app.use("/user", userRoute);
app.get("/:shortId",async(req,res)=> {
    const shortId=req.params.shortId;
    const entry=await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push:{
                visitHistory: {
                    timestamp:Date.now()
                },
            },
        }
    );
    res.redirect(entry.redirectURL);
})

app.listen(PORT, () => console.log(`Server Started At PORT: ${PORT}`));
