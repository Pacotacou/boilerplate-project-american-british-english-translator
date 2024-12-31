"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
    const translator = new Translator();

    app.route("/api/translate").post((req, res) => {
        const { text, locale } = req.body;
        const supportedLocales = ["american-to-british", "british-to-american"];

        // Validate required fields
        if (!text && text !== "") {
            return res.status(400).json({ error: "Required field(s) missing" });
        }
        if (!locale) {
            return res.status(400).json({ error: "Required field(s) missing" });
        }

        // Validate locale
        if (!supportedLocales.includes(locale)) {
            return res.status(400).json({ error: "Invalid value for locale field" });
        }

        // Handle empty text
        if (text.trim() === "") {
            return res.status(400).json({ error: "No text to translate" });
        }

        // Perform translation
        const translation = translator.translate(text, locale);
        return res.json({ text, translation });
    });
};
