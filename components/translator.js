const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')


// Helper functions
function invertObject(obj) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]));
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters for regex
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


class Translator {
    constructor() {
        this.americanOnly = require("./american-only.js");
        this.americanToBritishSpelling = require("./american-to-british-spelling.js");
        this.americanToBritishTitles = require("./american-to-british-titles.js");
        this.britishOnly = require("./british-only.js");

        // Precompute translation mappings for efficiency
        this.translationData = {
            "american-to-british": {
                words: { ...this.americanToBritishSpelling, ...this.americanOnly },
                titles: this.americanToBritishTitles,
                clockSymbol: { from: ":", to: "." },
            },
            "british-to-american": {
                words: { ...invertObject(this.americanToBritishSpelling), ...this.britishOnly },
                titles: invertObject(this.americanToBritishTitles),
                clockSymbol: { from: ".", to: ":" },
            },
        };
    }

    translate(input, locale) {
        const data = this.translationData[locale];
        if (!data) {
            throw new Error("Invalid locale. Supported locales are 'american-to-british' and 'british-to-american'.");
        }
    
        let translated = input;
    
        // Translate time formats first
        const clockRegex = new RegExp(`(\\d{1,2})${escapeRegExp(data.clockSymbol.from)}(\\d{1,2})(?=\\s|\\.|,|$)`, "g");
        translated = translated.replace(
            clockRegex,
            `<span class="highlight">$1${data.clockSymbol.to}$2</span>`
        );
    
        // Translate titles (capitalize the first letter of replacements)
        Object.entries(data.titles).forEach(([title, replacement]) => {
            const regex = new RegExp(`(?<=^|[.'"\\s])${escapeRegExp(title)}(?=[.'"\\s]|$)`, "gi");
            translated = translated.replace(
                regex,
                `<span class="highlight">${capitalize(replacement)}</span>`
            );
        });
    
        // Translate words and phrases
        Object.entries(data.words).forEach(([word, replacement]) => {
            const regex = new RegExp(`(?<=^|[.'"\\s])${escapeRegExp(word)}(?=[.'"\\s]|$)`, "gi");
            translated = translated.replace(
                regex,
                `<span class="highlight">${replacement}</span>`
            );
        });
    
        return translated !== input ? translated : "Everything looks good to me!";
    }
    
}



module.exports = Translator;
