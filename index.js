const express = require('express');
const app = express();
app.use(express.json());

const LICENSE_DB = {
    "DEV-2026": "2027-12-31",
    "BETA-2026": "2026-12-31",
    // Add buyer keys here
};

const BLACKLIST = ["BAD-KEY-1111"];

app.get('/check', (req, res) => {
    const { key } = req.query;

    if (!key) return res.json({ valid: false, message: "No key" });

    if (BLACKLIST.includes(key)) {
        return res.json({ valid: false, message: "Blacklisted" });
    }

    if (LICENSE_DB[key]) {
        const expiry = new Date(LICENSE_DB[key]);
        if (new Date() > expiry) {
            return res.json({ valid: false, message: "Expired" });
        }
        return res.json({ valid: true, expires: LICENSE_DB[key] });
    }

    return res.json({ valid: false, message: "Invalid key" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));