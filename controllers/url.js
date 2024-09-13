const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    await URL.deleteMany({shortId:null})
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        // Check if redirectURL already exists
        let urlEntry = await URL.findOne({ redirectURL: body.url });

        if (urlEntry) {
            // If the URL already exists, use its existing shortId
            const allurls = await URL.find();

            console.log("URL already exists:", urlEntry);
            return res.render("home", { id: urlEntry.shortId,urls:allurls });
        } else {
            // Generate a new shortId if the URL is not found
            const shortID = shortid.generate();

            // Create a new entry with the unique shortId and URL
            await URL.create({
                shortId: shortID,
                redirectURL: body.url,
                visitHistory: []
            });

            console.log("New URL entry created:", shortID);

            // Fetch all URLs to display
            const allurls = await URL.find();

            return res.render("home", { id: shortID, urls: allurls });
        }
    } catch (error) {
        console.error("Error creating new URL entry:", error);
        return res.status(500).send("Server error");
    }
}

module.exports = {
    handleGenerateNewShortURL,
};
