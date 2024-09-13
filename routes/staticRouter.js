const express=require("express")
const URL=require("../models/url")
const router=express.Router();

router.get('/', async (req, res) => {
    try {
        const allurls = await URL.find({}); // Fetch all URLs from your database
        res.render('home', { urls:allurls }); // Pass the URLs array to the EJS template
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
router.get("/signup", (req, res) => {
    return res.render("signup");
});
  
router.get("/login", (req, res) => {
    return res.render("login");
});
module.exports=router;